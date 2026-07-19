const Home = require("../model/home");
const User = require("../model/user");
const Host = require("../model/host");
const getCoordinates = require("../utils/geocode");
const cloudinary = require("../config/cloudinary");

// Helper to extract Cloudinary public id from a delivered URL as a fallback
function extractPublicIdFromUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname; // e.g. /res.cloudinary.com/<cloud>/image/upload/v1234567/Folder/public-id.jpg
    const m = path.match(/\/upload\/(?:.+\/)?v\d+\/(.+)\.[a-zA-Z0-9]+$/);
    if (m && m[1]) return m[1];
  } catch (e) {
    // ignore
  }
  return null;
}

exports.getHostHomes = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const host = await Host.findOne({ user: userId }).populate("homes");

    res.status(200).json({
      homes: host ? host.homes : [],
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch homes",
    });
  }
};

exports.postAddHome = async (req, res) => {
  try {
    const { homeName, price, address, rating, description } = req.body;

    if (
      !homeName?.trim() ||
      !price ||
      !address?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const coords = await getCoordinates(address);
    const photo = req.file.path || req.file.secure_url || req.file.url || null;
    const photoPublicId =
      req.file.filename || req.file.public_id || extractPublicIdFromUrl(photo);

    if (!photo) {
      return res.status(400).json({
        message: "Image upload failed",
      });
    }

    const home = new Home({
      homeName,
      host: req.user._id,
      price,
      address,
      location: {
        type: "Point",
        coordinates: [coords.lng, coords.lat],
      },
      rating,
      photo,
      photoPublicId,
      description,
    });

    await home.save();

    const userId = req.user?._id;
    if (userId) {
      let host = await Host.findOne({ user: userId });
      if (!host) {
        host = new Host({ user: userId, homes: [home._id] });
      } else {
        host.homes.push(home._id);
      }
      await host.save();
    }

    res.status(201).json({
      message: "Home added successfully",
      home,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Failed to add home",
    });
  }
};

exports.getEditHome = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.status(404).json({
        message: "Home not found",
      });
    }

    res.json(home);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.postEditHome = async (req, res) => {
  const { id, homeId, homeName, price, address, rating, description } = req.body;
  const targetHomeId = id || homeId;

  if (
    !targetHomeId ||
    !homeName?.trim() ||
    !price ||
    !address?.trim() ||
    !rating ||
    !description?.trim()
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }

  try {
    const home = await Home.findById(targetHomeId);
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    home.homeName = homeName;
    home.price = price;
    home.address = address;
    home.rating = rating;

    let coords;
    try {
      coords = await getCoordinates(address);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Could not find coordinates for that address" });
    }

    home.location = {
      type: "Point",
      coordinates: [coords.lng, coords.lat],
    };

    home.description = description;

    if (req.file) {
      const newPhotoUrl =
        req.file.path || req.file.secure_url || req.file.url || null;
      const newPhotoPublicId =
        req.file.filename ||
        req.file.public_id ||
        extractPublicIdFromUrl(newPhotoUrl);

      if (newPhotoUrl) {
        if (home.photoPublicId) {
          try {
            await cloudinary.uploader.destroy(home.photoPublicId, {
              resource_type: "image",
            });
          } catch (destroyErr) {
            console.warn(
              "Failed to delete previous image from Cloudinary:",
              destroyErr.message || destroyErr,
            );
          }
        }

        home.photo = newPhotoUrl;
        if (newPhotoPublicId) home.photoPublicId = newPhotoPublicId;
      }
    }

    await home.save();

    res.status(200).json({
      message: "Home updated successfully",
      home,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to update home" });
  }
};

exports.postDeleteHome = async (req, res) => {
  const homeId = req.params.homeId;

  try {
    const home = await Home.findById(homeId);

    if (!home) {
        res.status(500).json({
          message: "Home not found"
        });
    }

    // attempt to delete the image from Cloudinary
    try {
      if (home.photoPublicId) {
        await cloudinary.uploader.destroy(home.photoPublicId, {
          resource_type: "image",
        });
      } else {
        const extracted = extractPublicIdFromUrl(home.photo);
        if (extracted)
          await cloudinary.uploader.destroy(extracted, {
            resource_type: "image",
          });
      }
    } catch (destroyErr) {
      console.warn(
        "Failed to delete image from Cloudinary for home",
        homeId,
        destroyErr.message || destroyErr,
      );
    }

    await Home.findByIdAndDelete(homeId);

    await User.updateMany(
      { favourites: homeId },
      { $pull: { favourites: homeId } },
    );

    // Remove reference from the Host document for this user (if any)
    const userId = req.user?._id;
    if (userId) {
      await Host.updateOne({ user: userId }, { $pull: { homes: homeId } });
    } else {
      // fallback: remove from any host that references it
      await Host.updateMany({ homes: homeId }, { $pull: { homes: homeId } });
    }

    res.json({
      message: "Home deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

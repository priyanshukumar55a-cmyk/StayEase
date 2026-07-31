const Home = require("../model/home");
const User = require("../model/user");
const Host = require("../model/host");
const Booking = require("../model/booking");
const Review = require("../model/review");
const getCoordinates = require("../utils/geocode");
const cloudinary = require("../config/cloudinary");
const review = require("../model/review");

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

    const homes = await Home.find({
      host: userId,
    });

    res.status(200).json({
      homes,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch homes",
    });
  }
};

exports.postAddHome = async (req, res) => {
  try {
    const { homeName, price, address, description } = req.body;

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
    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0",
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
        await Host.updateMany(
          { user: userId },
          { $addToSet: { homes: home._id } },
        );
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
  const { id, homeId, homeName, price, address, description } = req.body;
  const targetHomeId = id || homeId;

  if (
    !targetHomeId ||
    !homeName?.trim() ||
    !price ||
    !address?.trim() ||
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
    if (home.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    home.homeName = homeName;
    home.price = price;
    home.address = address;

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
      res.status(404).json({
        message: "Home not found",
      });
    }
    if (home.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
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

    await Booking.deleteMany({
      home: homeId,
    });
    await Review.deleteMany({
      home: homeId,
    });

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

exports.getHostDashboardStats = async (req, res) => {
  try {
    const hostId = req.user._id;

    const homes = await Home.find({ host: hostId }).select("_id status");

    const homeIds = homes.map((home) => home._id);

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      reviews,
      bookings,
    ] = await Promise.all([
      Booking.countDocuments({ host: hostId }),
      Booking.countDocuments({
        host: hostId,
        status: "pending",
      }),
      Booking.countDocuments({
        host: hostId,
        status: "confirmed",
      }),
      Booking.countDocuments({
        host: hostId,
        status: "cancelled",
      }),
      Review.find({
        home: { $in: homeIds },
      })
        .populate("guest", "firstName lastName profileImage")
        .populate("home", "homeName")
        .sort({ createdAt: -1 })
        .limit(5),
      Booking.find({
        host: hostId,
        status: "confirmed",
      }).select("totalPrice"),
    ]);

    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalPrice,
      0,
    );

    const averageRating =
      reviews.length === 0
        ? 0
        : (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1);

    const totalReviews = reviews.length;

    const recentBookings = await Booking.find({
      home: { $in: homeIds },
    })
      .populate("guest", "firstName lastName")
      .populate("home", "homeName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalListings: homes.length,

      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,

      totalReviews,
      totalRevenue,
      averageRating,

      recentBookings,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics.",
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const hostId = req.user._id;
    const homes = await Home.find({ host: hostId }).select("_id status");

    const homeIds = homes.map((home) => home._id);

    const [reviews, fiveStarReviews] = await Promise.all([
      Review.find({
        home: { $in: homeIds },
      })
        .populate("guest", "firstName lastName profileImage")
        .populate("home", "homeName")
        .sort({ createdAt: -1 }),

      Review.countDocuments({
        home: { $in: homeIds },
        rating: 5,
      }),
    ]);

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1);

    res.status(200).json({
      reviews,
      averageRating,
      totalReviews,
      fiveStarReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch full reviews.",
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const hostId = req.user._id;
    const { status = "all", search = "" } = req.query;

    const filter = {
      host: hostId,
    };

    if (status !== "all") {
      filter.status = status;
    }

    let bookings = await Booking.find(filter)
      .populate({
        path: "guest",
        select: "firstName lastName email profileImage",
      })
      .populate({
        path: "home",
        select: "homeName photo address",
      })
      .sort({ createdAt: -1 });

    if (search.trim()) {
      const keyWord = search.toLowerCase();

      bookings = bookings.filter((booking) => {
        const guestName =
          `${booking.guest.firstName} ${booking.guest.lastName}`.toLowerCase();
        const homeName = booking.home.homeName.toLowerCase();

        return guestName.includes(keyWord) || homeName.includes(keyWord);
      });
    }

    const stats = {
      total: await Booking.countDocuments({ host: hostId }),
      pending: await Booking.countDocuments({
        host: hostId,
        status: "pending",
      }),
      confirmed: await Booking.countDocuments({
        host: hostId,
        status: "confirmed",
      }),
      cancelled: await Booking.countDocuments({
        host: hostId,
        status: "cancelled",
      }),
      declined: await Booking.countDocuments({
        host: hostId,
        status: "declined",
      }),
    };

    res.status(200).json({
      success: true,
      stats,
      bookings,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking requests.",
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const hostId = req.user._id;
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!["confirmed", "declined"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value.",
    });
  }
  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Booking has already been ${booking.status}.`,
      });
    }

    booking.status = status;
    if (status === "declined") {
      booking.declinedAt = new Date();
    }

    await booking.save();
    res.status(200).json({
      message:
        status === "confirmed"
          ? "Booking accepted successfully."
          : "Booking request declined successfully.",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status.",
    });
  }
};

const Home = require("../model/home");
const User = require("../model/user");

exports.getHomes = async (req, res) => {
  try {
    const homes = await Home.find();

    res.status(200).json({
      success: true,
      homes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const user = await User.findById(userId).populate("bookings");

    res.json({
      success: true,
      bookings: user.bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getFavouriteList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favourites");

    res.json({
      success: true,
      favourites: user.favourites,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getHomeDetails = async (req, res) => {
  try {
    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    res.json({
      success: true,
      home,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.postBookHome = async (req, res) => {
  try {
    const { checkin, checkout } = req.body;

    if (checkin >= checkout) {
      return res.status(400).json({
        success: false,
        message: "Invalid dates",
      });
    }

    // save booking

    res.status(201).json({
      success: true,
      message: "Booking successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.postAddToFavourite = async (req, res) => {
  try {
    const { homeId } = req.params;

    const result = await User.updateOne(
      { _id: req.user._id },
      { $addToSet: { favourites: homeId } },
    );

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "Home already added to favourites",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Added to favourites",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to add favourite",
    });
  }
};

exports.postRemoveFromFavourite = async (req, res) => {
  try {
    const { homeId } = req.params;

    await User.updateOne(
      { _id: req.user._id },
      { $pull: { favourites: homeId } },
    );

    return res.status(200).json({
      success: true,
      message: "Removed from favourites",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Failed to remove favourite",
    });
  }
};

const getCoordinates = require("../utils/geocode");

exports.createListing = async (req, res) => {
  try {
    const { address } = req.body;

    const { lat, lng } = await getCoordinates(address);

    const newHome = new Home({
      ...req.body,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat], // IMPORTANT ORDER
      },
    });

    await newHome.save();

    res.status(201).json({
      success: true,
      home: newHome,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

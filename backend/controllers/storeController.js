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
    const user = await User.findById(req.session.user._id).populate(
      "favourites",
    );

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

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }

  res.json({
    success: true,
    message: "Added to favourites",
  });
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites.pull(homeId);
    await user.save();
  }

  res.json({
    success: true,
    message: "Removed from favourites",
  });
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

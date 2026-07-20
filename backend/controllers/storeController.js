const Booking = require("../model/booking");
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
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const userId = req.user._id;

    const bookings = await Booking.find({ guest: userId })
      .populate("home")
      .populate("host", "firstName lastName email")
      .sort({ checkIn: -1 });

    res.json({
      success: true,
      bookings,
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
    const { checkIn, checkOut } = req.body;

    // Normalize and validate incoming dates to avoid invalid Date cast errors
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date",
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    const home = await Home.findById(req.params.homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }

    const existingBooking = await Booking.find({
      home: home._id,
      status: { $ne: "cancelled" },

      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (existingBooking.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Home is already booked for the selected dates",
      });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.max(
      1,
      Math.ceil((checkOutDate - checkInDate) / msPerDay),
    );

    const totalPrice = days * home.price;

    const booking = await Booking.create({
      guest: req.user._id,
      host: home.host,
      home: home._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      booking,
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

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking already cancelled",
      });
    }

    const hoursLeft =
      (new Date(booking.checkIn) - Date.now()) / (1000 * 60 * 60);

    if (hoursLeft < 24) {
      return res.status(400).json({
        message: "Booking can no longer be cancelled",
      });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();

    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
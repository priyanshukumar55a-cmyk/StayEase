const Home = require("../model/home");
const Booking = require("../model/booking");
const User = require("../model/user");
const Review = require("../model/review");

const normalizeBookingDate = (value) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value !== "string") {
    return new Date(value);
  }

  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (dateOnlyPattern.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  }

  return new Date(value);
};

exports.getHomes = async (req, res) => {
  try {
    const { page = 1, limit = 6, search = "" } = req.query;
    const query = {};

    if (search.trim()) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.$or = [
        { homeName: { $regex: escapedSearch, $options: "i" } },
        { address: { $regex: escapedSearch, $options: "i" } },
        { description: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    const totalHomes = await Home.countDocuments(query);
    const homes = await Home.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      homes,
      totalHomes,
      totalPages: Math.ceil(totalHomes / limit),
      currentPage: Number(page),
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
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map((booking) => {
      const hoursLeft =
        (new Date(booking.checkIn) - new Date()) / (1000 * 60 * 60);

      let bookingStage = null;

      if (booking.status === "confirmed") {
        const now = new Date();

        if (now < booking.checkIn) bookingStage = "upcoming";
        else if (now <= booking.checkOut) bookingStage = "ongoing";
        else bookingStage = "completed";
      }

      return {
        ...booking.toObject(),
        bookingStage,
        canCancel:
          booking.status === "pending" ||
          (booking.status === "confirmed" && hoursLeft >= 24),
      };
    });

    res.json({
      success: true,
      bookings: formattedBookings,
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
    const home = await Home.findById(req.params.homeId).populate({
      path: "host",
      select: "firstName lastName email profileImage",
    });

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found",
      });
    }
    const isFavourite = req.user
      ? req.user.favourites.some((id) => id.toString() === req.params.homeId)
      : false;

    res.status(200).json({
      success: true,
      home: {
        ...home.toObject(),
        isFavourite,
      },
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
    const checkInDate = normalizeBookingDate(checkIn);
    const checkOutDate = normalizeBookingDate(checkOut);

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
const home = require("../model/home");
const { default: mongoose } = require("mongoose");

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

    const checkInDate = normalizeBookingDate(booking.checkIn);
    const hoursLeft = (checkInDate.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursLeft < 24) {
      console.warn("[cancelBooking] cancellation blocked", {
        bookingId: booking._id.toString(),
        hoursLeft,
      });

      return res.status(400).json({
        message: "You can only cancel up to 24 hours before check-in.",
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

exports.postReviewHome = async (req, res) => {
  try {
    const homeId = req.params.homeId;
    const { rating, comment } = req.body;

    const booking = await Booking.findOne({
      home: homeId,
      guest: req.user._id,
      status: "confirmed",
      checkOut: { $lt: new Date() },
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "You can only review homes you have booked and stayed in.",
      });
    }

    const existingReview = await Review.findOne({
      guest: req.user._id,
      home: homeId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this home.",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const review = await Review.create({
      guest: req.user._id,
      home: homeId,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      {
        $match: {
          home: new mongoose.Types.ObjectId(homeId),
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const home = await Home.findById(homeId);
    if (home) {
      home.averageRating = stats[0]?.avg || 0;
      home.reviewCount = stats[0]?.count || 0;
      await home.save();
    }

    res.status(201).json({
      success: true,
      review,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getHomeReviews = async (req, res) => {
  try {
    const homeId = req.params.homeId;
    const reviews = await Review.find({
      home: homeId,
    })
      .populate("guest", "firstName lastName profileImage")
      .sort({ createdAt: -1 });

    const formattedReviews = reviews.map((review) => ({
      ...review.toObject(),
      isOwner:
        req.user && review.guest._id.toString() === req.user._id.toString(),
    }));

    res.status(200).json({
      success: true,
      reviews: formattedReviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};

exports.canReviewHome = async (req, res) => {
  try {
    const { homeId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const booking = await Booking.findOne({
      home: homeId,
      guest: req.user._id,
      status: "confirmed",
      checkOut: { $lt: new Date() },
    });

    if (!booking) {
      return res.json({
        success: true,
        canReview: false,
        alreadyReviewed: false,
      });
    }

    const existingReview = await Review.exists({
      home: homeId,
      guest: req.user._id,
    });

    return res.json({
      success: true,
      canReview: !existingReview,
      alreadyReviewed: !!existingReview,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review.",
      });
    }

    const homeId = review.home;

    await Review.findByIdAndDelete(reviewId);

    const stats = await Review.aggregate([
      {
        $match: {
          home: new mongoose.Types.ObjectId(homeId),
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Home.findByIdAndUpdate(homeId, {
      averageRating: stats[0]?.avg || 0,
      reviewCount: stats[0]?.count || 0,
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this review.",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    review.rating = rating;
    review.comment = comment.trim();

    await review.save();

    // Update home's average rating
    const stats = await Review.aggregate([
      {
        $match: {
          home: review.home,
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    await Home.findByIdAndUpdate(review.home, {
      averageRating: stats[0]?.avg || 0,
      reviewCount: stats[0]?.count || 0,
    });

    res.json({
      success: true,
      review,
      message: "Review updated successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

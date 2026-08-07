const crypto = require("crypto");
const razorpay = require("../utils/razorpay");

const Home = require("../model/home");
const User = require("../model/user");
const Booking = require("../model/booking");
const { sendBookingConfirmationEmail } = require("../utils/mailer");

const createOrder = async (req, res) => {
  try {
    const { homeId, checkIn, checkOut } = req.body;

    if (!homeId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in.",
      });
    }

    const existingBooking = await Booking.findOne({
      home: homeId,
      paymentStatus: "paid",
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate },
        },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Home is already booked for the selected dates.",
      });
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const totalNights = Math.ceil(
      (checkOutDate - checkInDate) / millisecondsPerDay,
    );

    const totalAmount = totalNights * home.price;

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      message: "Order created successfully.",
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      totalAmount,
      totalNights,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      homeId,
      checkIn,
      checkOut,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !homeId ||
      !checkIn ||
      !checkOut
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment details.",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }

    const home = await Home.findById(homeId);

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Home not found.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const totalNights = Math.ceil(
      (checkOutDate - checkInDate) / millisecondsPerDay,
    );

    const totalPrice = totalNights * home.price;
    const now = new Date();
    const bookingStage =
      now < checkInDate
        ? "upcoming"
        : now <= checkOutDate
          ? "ongoing"
          : "completed";

    const booking = await Booking.create({
      guest: req.user.id,
      home: homeId,
      host: home.host,

      checkIn: checkInDate,
      checkOut: checkOutDate,

      totalPrice,
      status: "confirmed",
      bookingStage,

      paymentStatus: "paid",
      paidAt: new Date(),

      payment: {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        amount: totalPrice,
        status: "paid",
        paidAt: new Date(),
      },
    });

    const guest = req.user;
    const host = await User.findById(home.host).select(
      "firstName lastName email",
    );
    try {
      await sendBookingConfirmationEmail({
        to: guest.email,
        guestName: `${guest.firstName} ${guest.lastName}`,
        bookingId: booking._id,
        paymentId: razorpay_payment_id,
        homeName: home.homeName,
        homeImage: home.photo,
        address: home.address,
        hostName: `${host.firstName} ${host.lastName}`,
        checkIn: checkInDate.toDateString(),
        checkOut: checkOutDate.toDateString(),
        totalPrice,
        nights: totalNights,
      });
    } catch (error) {
      console.error("Booking email failed:", error);
    }

    return res.status(201).json({
      success: true,
      message: "Payment verified successfully.",
      booking,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};

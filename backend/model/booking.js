const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    home: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Home",
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },

    payment: {
      orderId: String,
      paymentId: String,
      signature: String,
      amount: Number,
      status: {
        type: String,
        enum: ["paid", "failed"],
        default: "paid",
      },
    },
    cancelledAt: Date,
    declinedAt: Date,
    paidAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);

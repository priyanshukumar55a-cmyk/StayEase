const express = require("express");
const paymentRouter = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const { ensureAuth } = require("../middleware/auth");

paymentRouter.post("/create-order", ensureAuth, createOrder);

paymentRouter.post("/verify", ensureAuth, verifyPayment);

module.exports = paymentRouter;

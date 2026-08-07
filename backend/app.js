const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const cookieParser = require("cookie-parser");

const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 3000;

// Use your MongoDB Atlas URL
const DB_PATH = process.env.MONGO_URI;

// Validate required environment variables early to fail fast with clear messages
const requiredEnvs = ["MONGO_URI", "JWT_SECRET", "EMAIL", "EMAIL_PASS"];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing required environment variables:", missing.join(", "));
  console.error(
    "Set them in your environment or .env before starting the app.",
  );
  process.exit(1);
}

// Fix DNS issue for MongoDB Atlas (only when DB_PATH is set)
if (DB_PATH && DB_PATH.startsWith("mongodb+srv://")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

//core module
const path = require("path");

const cors = require("cors");

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://stay-ease-app-flax.vercel.app"],
    credentials: true,
  }),
);

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");
const authRouter = require("./routes/authRouter");
const paymentRouter = require("./routes/paymentRouter");
const { verifyPayment } = require("./controllers/paymentController");
const { ensureAuth } = require("./middleware/auth");

app.use((req, res, next) => {
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/auth", authRouter);
app.use("/", storeRouter);
app.post("/api/verify-payment", ensureAuth, verifyPayment);
app.use("/api/payment", paymentRouter);
app.use("/host", hostRouter);

// Connect MongoDB
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:");
    console.log(err);
  });

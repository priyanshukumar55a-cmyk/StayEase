const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

require("dotenv").config();

const cookieParser = require("cookie-parser");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const nodemailer = require("nodemailer");

const app = express();

const PORT = process.env.PORT || 3000;

// Use your MongoDB Atlas URL
const DB_PATH = process.env.MONGO_URI;

// Fix DNS issue for MongoDB Atlas
if (DB_PATH.startsWith("mongodb+srv://")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

//core module
const path = require("path");

const cors = require("cors");

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://stay-ease-app-flax.vercel.app/"],
    credentials: true,
  }),
);

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");
const authRouter = require("./routes/authRouter");

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

app.use((req, res, next) => {
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.use("/auth", authRouter);
app.use("/", storeRouter);
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

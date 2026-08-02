// Database
const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["guest", "host"],
      default: "guest",
    },
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Home",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    tokenExpiry: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpiry: {
      type: Date,
    },
    profileImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);

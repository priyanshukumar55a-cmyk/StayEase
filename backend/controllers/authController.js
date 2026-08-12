const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const Host = require("../model/host");
const Booking = require("../model/booking");
const crypto = require("crypto");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const generateToken = require("../utils/generateToken");
const { ReturnDocument } = require("mongodb");
const { sendVerificationEmail } = require("../utils/mailer");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    const bookings = await Booking.countDocuments({
      guest: req.user._id,
    });

    const confirmedBookings = await Booking.countDocuments({
      guest: req.user._id,
      status: "confirmed",
    });

    const cancelledBookings = await Booking.countDocuments({
      guest: req.user._id,
      status: "cancelled",
    });

    res.json({
      user,
      stats: {
        bookings,
        confirmedBookings,
        cancelledBookings,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bio: req.body.bio,
    };

    if (req.file) {
      updates.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      ReturnDocument: "after",
    }).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

exports.postSignup = [
  check("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long.")
    .matches(/^[A-Za-z]+$/)
    .withMessage("First name must contain only letters."),

  check("lastName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long.")
    .matches(/^[A-Za-z]*$/)
    .withMessage("Last name must contain only letters."),

  check("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  check("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[@$!%*?&]/)
    .withMessage("Password must contain at least one special character.")
    .trim(),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("User type is required.")
    .isIn(["host", "guest"])
    .withMessage("User type must be either 'host' or 'guest'."),

  check("terms")
    .equals("on")
    .withMessage("You must accept the terms and conditions."),

  async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
      terms,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array().map((err) => err.msg),
      });
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const rawToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        userType,
        verificationToken: hashedToken,
        tokenExpiry: Date.now() + 3600000,
      });

      let host = null;
      if (userType === "host") {
        host = new Host({ user: user._id, homes: [] });
      }

      const verifyUrl = `${FRONTEND_URL}/auth/verify-email?token=${rawToken}`;

      try {
        // Try to send verification email before persisting to DB.
        await sendVerificationEmail({
          to: email,
          verifyUrl,
        });
      } catch (mailError) {
        console.error("Failed to send verification email:", mailError);
        return res.status(500).json({
          success: false,
          message: "Unable to send verification email. Please try again later.",
        });
      }

      // Email sent OK — now persist user (and host if any).
      await user.save();
      if (host) await host.save();

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userType: user.userType,
        },
      });
    } catch (err) {
      return res.status(422).json({
        success: false,
        message: err.message,
      });
    }
  },
];

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email first.",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
    },
  });
};

exports.postLogout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetTokenExpiry = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${FRONTEND_URL}/reset-password?token=${rawToken}`;

    await sendVerificationEmail({
      to: user.email,
      verifyUrl: resetUrl,
      subject: "Reset your StayEase password",
      title: "Reset your password",
      message:
        "Use the secure link below to choose a new password for your StayEase account.",
    });

    return res.status(200).json({
      success: true,
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process password reset right now.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to reset password right now.",
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      verificationToken: hashedToken,
      tokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    const user_token = generateToken(user._id);
    res.cookie("token", user_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You are now logged in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying your email.",
    });
  }
};

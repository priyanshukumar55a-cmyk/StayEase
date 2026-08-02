// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");
const { ensureGuest, ensureAuth } = require("../middleware/auth");
const upload = require("../middleware/multer");

authRouter.post("/login", ensureGuest, authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/signup", ensureGuest, authController.postSignup);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.get("/me", ensureAuth, (req, res) => {
    res.json({
        user:req.user
    })
});
authRouter.get("/profile", ensureAuth, authController.getProfile);
authRouter.patch(
  "/profile/edit",
  ensureAuth,
  upload.single("profileImage"),
  authController.updateProfile,
);

module.exports = authRouter;
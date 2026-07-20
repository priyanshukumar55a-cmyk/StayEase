// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");
const { ensureGuest, ensureAuth } = require("../middleware/auth");

authRouter.post("/login", ensureGuest, authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/signup", ensureGuest, authController.postSignup);
authRouter.get("/verify-email", authController.verifyEmail);
authRouter.get("/me", ensureAuth, (req, res) => {
    res.json({
        user:req.user
    })
});
authRouter.get("/profile", ensureAuth, authController.getProfile);

module.exports = authRouter;
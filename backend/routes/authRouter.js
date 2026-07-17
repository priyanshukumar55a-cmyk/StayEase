// External Module
const express = require("express");
const authRouter = express.Router();

// Local Module
const authController = require("../controllers/authController");
const { ensureGuest, ensureAuth } = require("../middleware/auth");

authRouter.get("/login", ensureGuest, authController.getLogin);
authRouter.get("/signup", ensureGuest, authController.getSignup);
authRouter.post("/login", ensureGuest, authController.postLogin);
authRouter.post("/logout", authController.postLogout);
authRouter.post("/signup", ensureGuest, authController.postSignup);
authRouter.get("/verify-email", authController.getVerifyEmail);
authRouter.get("/me", ensureAuth, (req, res) => {
    res.json({
        user:req.user
    })
});

module.exports = authRouter;
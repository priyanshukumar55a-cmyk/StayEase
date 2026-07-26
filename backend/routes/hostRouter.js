// External Module
const express = require("express");
const hostRouter = express.Router();
const upload = require("../middleware/multer");

// Local Module
const hostController = require("../controllers/hostController");
const { ensureAuth, ensureHost } = require("../middleware/auth");

hostRouter.post(
    "/add-home",
    ensureAuth,
    ensureHost,
    upload.single("photo"),
    hostController.postAddHome
);
hostRouter.get("/homes", ensureAuth, ensureHost, hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", ensureAuth, ensureHost, hostController.getEditHome);
hostRouter.post(
    "/edit-home",
    ensureAuth,
    ensureHost,
    upload.single("photo"),
    hostController.postEditHome
);
hostRouter.delete("/delete-home/:homeId", ensureAuth, ensureHost, hostController.postDeleteHome);
hostRouter.get(
  "/dashboard",
  ensureAuth,
  ensureHost,
  hostController.getHostDashboardStats,
);

module.exports = hostRouter;
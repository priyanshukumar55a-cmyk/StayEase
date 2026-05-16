// External Module
const express = require("express");
const hostRouter = express.Router();
const upload = require("../middleware/multer");

// Local Module
const hostController = require("../controllers/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post(
    "/add-home",
    upload.single("photo"),
    hostController.postAddHome
);
hostRouter.get("/host-home-list", hostController.getHostHomes);
hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post(
    "/edit-home",
    upload.single("photo"),
    hostController.postEditHome
);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

module.exports = hostRouter;
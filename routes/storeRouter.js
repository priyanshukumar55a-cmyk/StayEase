// External module
const express = require('express')

//Local module
const storeController = require("../controllers/storeController");

const storeRouter = express.Router();

storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings", storeController.getBookings);
storeRouter.get("/", storeController.getIndex);
storeRouter.get("/favourites", storeController.getFavouriteList);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails)
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.post("/favourite/delete/:homeId", storeController.postRemoveFromFavourite);

module.exports = storeRouter;
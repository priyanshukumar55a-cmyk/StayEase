// External module
const express = require('express')

//Local module
const storeController = require("../controllers/storeController");
const upload = require("../middleware/multer");
const { ensureAuth } = require("../middleware/auth");

const storeRouter = express.Router();

storeRouter.get("/homes", storeController.getHomes);
storeRouter.get("/bookings", ensureAuth, storeController.getBookings);
storeRouter.get("/favourites", ensureAuth, storeController.getFavouriteList);
storeRouter.get("/homes/:homeId", storeController.getHomeDetails)
storeRouter.post("/homes/:homeId/book", ensureAuth, storeController.postBookHome);
storeRouter.patch("/bookings/:bookingId/cancel", ensureAuth, storeController.cancelBooking);
storeRouter.post("/favourites/:homeId", ensureAuth, storeController.postAddToFavourite);
storeRouter.post("/favourite/delete/:homeId", ensureAuth, storeController.postRemoveFromFavourite);

storeRouter.post("/upload", upload.single("image"), (req, res) => {
    console.log('Upload route - file object:', req.file);

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = req.file.path || req.file.secure_url || req.file.url || null;
    if (!imageUrl) {
        return res.status(500).json({ error: 'Uploaded but no URL returned by Cloudinary' });
    }

    res.json({
        message: "Uploaded successfully",
        image: imageUrl,
    });
});

module.exports = storeRouter;
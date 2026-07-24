// External module
const express = require("express");

//Local module
const storeController = require("../controllers/storeController");
const upload = require("../middleware/multer");
const { ensureAuth, optionalAuth } = require("../middleware/auth");

const storeRouter = express.Router();

storeRouter.get("/homes", ensureAuth, storeController.getHomes);
storeRouter.get("/homes/:homeId", optionalAuth, storeController.getHomeDetails);

storeRouter.get("/bookings", ensureAuth, storeController.getBookings);
storeRouter.post(
  "/homes/:homeId/book",
  ensureAuth,
  storeController.postBookHome,
);

storeRouter.get("/favourites", ensureAuth, storeController.getFavouriteList);
storeRouter.post(
  "/favourites/:homeId",
  ensureAuth,
  storeController.postAddToFavourite,
);
storeRouter.post(
  "/favourite/delete/:homeId",
  ensureAuth,
  storeController.postRemoveFromFavourite,
);

storeRouter.get(
  "/homes/:homeId/reviews",
  ensureAuth,
  storeController.getHomeReviews,
);
storeRouter.get(
  "/homes/:homeId/can-review",
  ensureAuth,
  storeController.canReviewHome,
);
storeRouter.post(
  "/homes/:homeId/reviews",
  ensureAuth,
  storeController.postReviewHome,
);
// storeRouter.patch("/reviews/:reviewId", ensureAuth, storeController.editReview);
// storeRouter.delete(
//   "/reviews/:reviewId",
//   ensureAuth,
//   storeController.deleteReview,
// );
storeRouter.patch(
  "/bookings/:bookingId/cancel",
  ensureAuth,
  storeController.cancelBooking,
);

storeRouter.post("/upload", upload.single("image"), (req, res) => {
  console.log("Upload route - file object:", req.file);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = req.file.path || req.file.secure_url || req.file.url || null;
  if (!imageUrl) {
    return res
      .status(500)
      .json({ error: "Uploaded but no URL returned by Cloudinary" });
  }

  res.json({
    message: "Uploaded successfully",
    image: imageUrl,
  });
});

module.exports = storeRouter;

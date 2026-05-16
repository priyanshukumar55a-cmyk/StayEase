const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const originalName = (file.originalname || "image").replace(/\.[^/.]+$/, "");
        return {
            folder: "StayEase",
            public_id: `${Date.now()}-${originalName}`,
            allowed_formats: ["png", "jpg", "jpeg"],
            transformation: [{ quality: "auto", fetch_format: "auto" }],
        };
    },
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed!"), false);
    } else {
        cb(null, true);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
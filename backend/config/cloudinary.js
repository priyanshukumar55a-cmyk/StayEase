const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const cloudName = process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET;

if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL,
    });
} 
else {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
}

// Validate configuration early to provide clearer errors
if (!cloudinary.config().cloud_name) {
    console.warn(
        'Warning: Cloudinary is not fully configured. Please set CLOUD_NAME/CLOUD_API_KEY/CLOUD_API_SECRET or CLOUDINARY_URL in your environment.'
    );
}

module.exports = cloudinary;
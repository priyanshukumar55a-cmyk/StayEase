const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        guest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        home: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Home",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
            required: true,
            maxlength:500,
        },
    },
    { timestamps: true }
);      

reviewSchema.index({ guest: 1, home: 1 }, { unique: true });
reviewSchema.index({ home: 1 });
module.exports = mongoose.model("Review", reviewSchema);
    
const { default: mongoose } = require("mongoose");

const homeSchema = mongoose.Schema(
  {
    homeName: {
      type: String,
      required: true,
      trim: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    photo: {
      type: String,
      required: true,
    },

    photoPublicId: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

homeSchema.index({ host: 1 });
homeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Home", homeSchema);

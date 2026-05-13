// Database
const { default: mongoose } = require("mongoose");

/*

    save()
    find()
    findById(homeId)
    deleteById(homeId)
*/

const homeSchema = mongoose.Schema({
    homeName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
        },
    rating: {
        type: Number,
        required: true
    },
    photo: String,
    description: String,
});

// homeSchema.pre('findOneAndDelete', async function(next) {
//     const homeId = this.getQuery()._id;
//     await Favourite.deleteMany({homeId: homeId});
//     next();
// })

module.exports = mongoose.model('Home', homeSchema);
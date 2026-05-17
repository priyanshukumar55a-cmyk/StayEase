// Database
const { default: mongoose } = require("mongoose");

// Models
const Home = require("../model/home");
const User = require("../model/user");

const hostSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    homes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Home'
    }]
});

module.exports = mongoose.model("Host", hostSchema);
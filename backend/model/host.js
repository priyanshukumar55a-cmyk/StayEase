// Database
const { default: mongoose } = require("mongoose");

// Models
const Home = require("./home");
const User = require("./user");

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
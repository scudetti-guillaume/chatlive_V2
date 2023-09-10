const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    login: {
        type: Boolean,
        default: false,
    },
    pictureUser : {
      type: String,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
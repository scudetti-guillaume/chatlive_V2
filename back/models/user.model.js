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
        type: String,
        default: '',
    },
    pictureUser: {
        type: String,
        default: 'https://www.lesiteduscudo.com/chatsocV2/pictures/default/default-user.png',
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
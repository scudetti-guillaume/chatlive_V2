const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    // required: true,
  },
  pseudo: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    // default: Date.now,
  },
  pictureUser: {
    type: String,
  },
  pictureMessage: {
    type: String,
  }
});

module.exports = mongoose.model('Message', messageSchema);
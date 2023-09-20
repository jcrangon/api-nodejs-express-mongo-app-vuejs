const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    lastName: {
        type: String,
        required: true,
    },

    firstName: {
      type: String,
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    image: {
        type: String,
        required: false,
    },

    userId: {
      type: String,
      required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Profile', ProfileSchema);
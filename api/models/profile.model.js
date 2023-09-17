const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
},
{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        min: 6,
    },

    role: {
      type: String,
      required: true,
      default: 'ROLE_USER'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
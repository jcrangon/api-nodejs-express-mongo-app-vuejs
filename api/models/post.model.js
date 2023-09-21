const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    extract: {
        type: String,
        required: false,
    },
    cover: {
        type: String,
        default: '/images/generic1.jpg',
    },
    userId: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);
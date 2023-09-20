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
        default: 'generic1.jpeg',
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
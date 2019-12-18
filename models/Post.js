const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 4
    },
    description:{
        type: String,
        required: true,
        min: 4
    },
    img: {
        type: String,
        required: true,
        min: 4
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;



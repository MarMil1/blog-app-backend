const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: false
    }
  }, 
  { timestamps: true }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
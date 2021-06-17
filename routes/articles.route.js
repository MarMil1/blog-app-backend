const router = require('express').Router();
const Article = require('../models/article.model');

// Create new article
router.post('/', async (req, res) => {
    const newArticle = new Article(req.body)
    try {
        const savedArticle = await newArticle.save();
        res.status(200).json(savedArticle);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update article
router.put('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article.username === req.body.username) {
            try {
                const updatedArticle = await Article.findByIdAndUpdate(
                    req.params.id, 
                    {
                        $set: req.body,
                    }, 
                    { new: true }
                );
                res.status(200).json(updatedArticle);
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("Update not allowed.");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Delete article
router.delete('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article.username === req.body.username) {
            try {
                await article.delete();
                res.status(200).json("Article deleted.");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("Delete not allowed.");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});


// Get article
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all articles
router.get('/', async (req, res) => {
    const username = req.query.user;
    const categoryName = req.query.cat;
    try {
        let articles; 
        if (username) {
            articles = await Article.find({ username })
        } else if (categoryName) {
            articles = await Article.find({ categories: {
                $in: [categoryName] 
            }});
        } else {
            articles = await Article.find();
        }
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
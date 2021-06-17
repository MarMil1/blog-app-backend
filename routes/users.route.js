const router = require('express').Router();
const User = require('../models/user.model');
const Article = require('../models/article.model');
const bcrypt = require('bcrypt');

// Update user
router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            }, { new: true });
            res.status(200).json(updatedUser);
        
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("Update not allowed.")
    }
    
});

// Delete user
router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            try {
                await Article.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User deleted.");
            } catch (error) {
                res.status(500).json(error);
            }
        } catch (error) {
            res.status(404).json("User not found.");
        }
    } else {
        res.status(401).json("Delete not allowed.");
    }
    
});

// Get user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...userNoPassword } = user._doc;
        res.status(200).json(userNoPassword);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;
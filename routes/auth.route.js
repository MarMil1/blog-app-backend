const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

// Register user
router.post('/register', async (req, res) => {
    try {
        // Hash password using bcrypt (this prevents seeing real password in db)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Login user
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(400).json("Incorrect username.");

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        !isValidPassword && res.status(400).json("Incorrect password.");

        const { password, ...userNoPassword } = user._doc;
        res.status(200).json(userNoPassword);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
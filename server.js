const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/users.route');
const articleRoute = require('./routes/articles.route');
const categoryRoute = require('./routes/categories.route');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })
    .then( () => {console.log('Mongo Database Connected Successfully!')} )
    .catch( (error) => {console.log(error)} );

// for legacy browsers
app.use(cors({optionsSuccessStatus: 200}));

// Storage for images
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, req.body.name);
    }
});

const upload = multer({ storage: storage });
app.post('api/upload', upload.single('file'), (req, res) => {
    res.status(200).json("File uploaded.")
})

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/articles", articleRoute);
app.use("/api/categories", categoryRoute);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
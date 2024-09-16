const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// MongoDB connection using MONGO_URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Mongoose schema and model
const imageSchema = new mongoose.Schema({
  imageData: String,
  name: String,
});

const Image = mongoose.model('Image', imageSchema);

// Middleware for validating image data
const validateImageData = (req, res, next) => {
  const { imageName, imageData } = req.body;
  if (!imageName || !imageData) {
    return res.status(400).json({ error: 'Image name and data are required.' });
  }
  next();
};

app.get('/', (req, res) => {
  res.send('Backend is working!');
});


// Save canvas image as Base64 in MongoDB
app.post('/save-image', validateImageData, async (req, res) => {
  const { imageName, imageData } = req.body;

  try {
    const image = new Image({
      name: imageName, // Save the image name
      imageData: imageData, // Save base64 image data
    });

    await image.save();
    res.send('Image saved successfully!');
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).send('Error saving image.');
  }
});

// Fetch All Images
app.get('/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Error fetching images.');
  }
});

// Fetch Specific Image
app.get('/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (image) {
      res.json(image);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).send('Error fetching image.');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

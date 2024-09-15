const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Image = require('../models/Image'); // Adjust path based on your structure
require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// Routes

// Save canvas image as Base64 in MongoDB
app.post('/api/save-image', async (req, res) => {
  const { imageName, imageData } = req.body;

  // Validate that imageName and imageData are provided
  if (!imageName || !imageData) {
    return res.status(400).send('Image name and data are required.');
  }

  try {
    // Save image and image name to MongoDB
    const image = new Image({
      name: imageName,  // Make sure to save the image name
      imageData: imageData, // Save base64 image data
    });

    await image.save();
    res.send('Image saved successfully!');
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).send('Error saving image.');
  }
});

// Fetch all images
app.get('/api/images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    res.status(500).send('Error fetching images.');
  }
});

// Fetch specific image by ID
app.get('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (image) {
      res.json(image);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    res.status(500).send('Error fetching image.');
  }
});

module.exports = app;

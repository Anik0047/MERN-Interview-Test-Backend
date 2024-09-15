const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageData: String,
  name: String,
});

module.exports = mongoose.model('Image', imageSchema);

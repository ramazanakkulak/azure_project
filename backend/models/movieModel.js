const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

///        ~ MONGODB SCHEMA ~        ///

const movieSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Please tell us your image url!.']
  },
  title: {
    type: String,
    required: [true, 'Please tell us your image title!.']
  },
  info: {
    type: String,
    required: [true, 'Please tell us your image info!.']
  },
  director: {
    type: String,
    required: [true, 'Please tell us your image director!.']
  },
  actors: {
    type: String,
    required: [true, 'Please tell us your image actors!.']
  },
  fragman: {
    type: String,
    required: [true, 'Please tell us your image fragman!.']
  },
  text: {
    type: String,
    required: [true, 'Please tell us your image text!.']
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;

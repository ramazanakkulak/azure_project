const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

///          ~ MONGODB SCHEMA ~        ///

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please tell us your name!.']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email!.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provice a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!.'],
    minlength: 8
  }
});
/**
 * @desc Password hashing must be done before registering a user to the database.
 *       This function is a schema function.
 * @next
 * @access PRIVATE
 */
userSchema.pre('save', async function(next) {
  // Onyl run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

/**
 * @param {string,string} password
 * @desc A comparison was made between the password that the user wrote during
 *       password update and the hash code in the database.
 *       This function is a schema function.
 * @return boolean value
 * @access PRIVATE
 */
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;

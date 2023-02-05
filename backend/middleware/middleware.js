const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

///         ~ MIDDLEWARE ~         ///\ \
/**
 * ~~ MIDDLEWARE ~~
 * @param {header} Authorization Bearer "token"
 * @desc The middleware function should be used when a jwt control is required.
 *       Required to protect important user routes.
 *       Jwt is an open standard for sharing security information between server and client.
 *       Each jwt contains a json object, and these json objects also have some claims.
 *       It is encrypted with a cryptographic algorithm to ensure that the requests cannot be changed.
 * @next
 * @access PRIVATE
 */
module.exports = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  req.user = currentUser;
  next();
});

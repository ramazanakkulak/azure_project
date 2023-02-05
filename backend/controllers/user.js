const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
var globalConfig = require('../config/config');
globalConfig = globalConfig.MESSAGES.ROUTES;
const getKey = require('../connection/vault');

////////////////////////////////////////\
///   ~ USER CONTROLLER ~  ///\ \
//////////////////////////////////////\ \ \

/**
 * Returns JWT TOKEN
 * @param {number} id It is the mongodb "_id,username,email,iat,exp" value of the user.
 * @desc This function generates only JWT.
 * @return {string} Returns a json web token in string format.
 */
const signToken = (id, username, email, secret) => {
  return jwt.sign({ id, username, email }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Returns JWT TOKEN USER INFORMATION
 * @param {string,number,res,secret}
 * @desc User information is entered and necessary login information, jwt and
 *       template configuration values are processed.
 * @return {string} Returns a user information, json web token and template configurasyon in
 *         string format.
 * @access PUBLIC
 */
const createSendToken = (user, statusCode, res, secret) => {
  const token = signToken(user._id, user.username, user.email, secret);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: false,
    secure: false,
    withCredentials: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    message: new AppError(globalConfig.USER.LOGIN_SUCCESS, statusCode),
    status: '200',
    token: token,
    username: user.username,
    email: user.email,
    response: 'ok'
  });
};

/**
 * Returns status
 * @route /api/v1/auth/register
 * @desc It is a necessary function for users to register to the system.
 * @return {string} lots of user information
 * @access PUBLIC
 */
exports.register = catchAsync(async (req, res, next) => {
  const registerUser = req.body;
  console.log(registerUser);
  if (!registerUser) {
    return res.status(400).json({
      message: new AppError(globalConfig.USER.REQUIRED_INFO, 400),
      status: 'fail',
      body: req.body,
      statusCode: 400
    });
  }
  if (await User.findOne({ username: registerUser.username })) {
    return res.status(400).json({
      message: new AppError(globalConfig.USER.USERNAME_EXIST, 400),
      status: 'fail',
      body: req.body,
      statusCode: 400
    });
  }
  if (await User.findOne({ email: registerUser.email })) {
    return res.status(400).json({
      message: new AppError(globalConfig.USER.EMAIL_EXIST, 400),
      status: 'fail',
      body: req.body,
      statusCode: 400
    });
  }
  await User.create(registerUser);
  res.status(200).json({
    status: 'success',
    message: globalConfig.USER.REGISTER_SUCCESS,
    body: req.body,
    statusCode: 200
  });
});

/**
 * @route /api/v1/users/login
 * @param {json} data email password
 * @desc It is the function where a registered user performs the login process after the
 *       necessary information is checked.
 * @return {string} Returns a string value
 * @access PUBLIC
 */
exports.login = catchAsync(async (req, res, next) => {
  const secretJWT = await getKey.getKeyVault('jwtKey');
  var { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: new AppError(globalConfig.USER.PROVIDE_INFORMATION, 401),
      status: 'fail',
      body: req.body,
      statusCode: 401
    });
  }
  const user = await User.findOne({ email }).select('+password');
  console.log(user);
  if (!user) {
    return res.status(401).json({
      message: new AppError(globalConfig.USER.USER_NOT_FOUND, 401),
      status: 'fail',
      body: req.body,
      statusCode: 401
    });
  }
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      message: new AppError(globalConfig.USER.PASSWORD_INCORRECT, 401),
      status: 'fail',
      body: req.body,
      statusCode: 401
    });
  }
  createSendToken(user, 200, res, secretJWT);
});

/**
 * @route /api/v1/auth/login
 * @return {string} Returns a string value
 * @access PUBLIC
 */
exports.status = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success'
  });
});

const movie = require('../models/movieModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
var globalConfig = require('../config/config');
const fs = require('fs');
globalConfig = globalConfig.MESSAGES.ROUTES;

///   ~ MOVIE CONTROLLER ~  ///\ \
/**
 * @route /api/v1/movie/create
 * @param {json} json file
 * @desc It is the function of writing the database of the movies in the vision.
 * @return {json}
 * @access PUBLIC
 */
exports.movieCreate = catchAsync(async (req, res, next) => {
  const data = await JSON.parse(
    fs.readFileSync('./utils/cinema.json', 'utf-8')
  );
  try {
    await movie.create(data);
    console.log('Data succesfull imported.');
    // to exit the process
  } catch (error) {
    console.log('error', error);
    return res.status(401).json({
      message: new AppError(globalConfig.CINEMA.DATABASE_FAIL, 401),
      status: 'fail',
      body: 'null',
      statusCode: 401
    });
  }
  return res.status(200).json({
    message: new AppError(globalConfig.CINEMA.DATABASE_STATUS, 200),
    status: 'success',
    body: 'null',
    statusCode: 200
  });
});

/**
 * @route /api/v1/movie/data
 * @desc Lists all movies written to the database.
 * @return {string}
 * @access PUBLIC
 */
exports.getMovie = catchAsync(async (req, res, next) => {
  const data = await movie.find({});
  return res.status(200).json(data);
});

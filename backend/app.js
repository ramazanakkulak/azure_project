const express = require('express');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const cinemaRouter = require('./routes/movieRoutes');

const globalErrorHandler = require('./controllers/errorController');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cookieParser());
app.use(cors({ origin: [process.env.UI], origin: true, credentials: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '20kb' }));
app.use(mongoSanitize());
// Data sanitization agains XSS
app.use(xss());
// Serving static files
app.use(express.static(`${__dirname}/public`));
app.use(express.urlencoded({ extended: false })); //to get data in html // enable

app.use((req, res, next) => {
  console.log('Backend is running...');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers)
  next();
});
// 3) ROUTES
app.use('/api/v1/auth', userRouter);
app.use('/api/v1/cinema', cinemaRouter);
/// ~ Error handler ~ ///
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// ~ Error design ~ //
app.use(globalErrorHandler);

module.exports = app;

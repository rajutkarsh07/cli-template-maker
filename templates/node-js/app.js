const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');

const app = express();

/// set security HTTP headers

app.use(helmet());

/// Development Login

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/// Limit requests from same API

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // means 100 request per hour
  message: 'To many request from this IP, try again after an hour',
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' })); //limit data upto 190kb

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// if param has multiple parameter....
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

/// Test middleware

app.use((req, res, next) => {
  req.requestTIme = new Date().toISOString();
  // console.log(req.requestTIme);
  console.log(req.headers);
  next();
});

app.use('/api/v1/users', userRouter);

// If the code run upto this means request response cycle is not finished yet then it will show html error we have to change it
// This will run for all the http methods because of all and *

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// four arguments in use means error
app.use(globalErrorHandler);

module.exports = app;

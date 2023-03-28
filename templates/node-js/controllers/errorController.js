const AppError = require('./../utils/appError');

const handleCastError = (err) => {
  const msg = `Invalid ${err.path} : ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateFields = (err) => {
  const msg = `Duplicate Field value. Enter another value`;
  return new AppError(msg, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message); // to get all the errors
  const msg = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(msg, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token, Please login again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired please login again', 401);
};

//function for error msg for developer
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack, // this shows where the error happened
  });
};

//function for error msg for production
const sendErrorProd = (err, res) => {
  //known error msg

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //unknown error msg
  else {
    console.error('error', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //error msg for us
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  //error msg for client
  else if (process.env.NODE_ENV == 'production') {
    let error = { ...err }; // storing error

    if (err.name === 'CastError') {
      error = handleCastError(error);
    }

    if (err.code === 11000) {
      error = handleDuplicateFields(error);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationError(error);
    }

    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

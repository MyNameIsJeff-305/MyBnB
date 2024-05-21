const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');

const routes = require('./routes');
const { environment } = require('./config');
const isProduction = environment === 'production';

const app = express();
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());


//Security Middleware
if (!isProduction) {
    app.use(cors()); //enable cors in development exclusively
}

app.use(
    helmet.crossOriginResourcePolicy({
        policy: 'cross-origin'
    })
);

//_csrf token and req.csrfToken
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && 'Lax',
            httpOnly: true
        }
    }));

app.use(routes); //API routes

//Catch unhandled requests and orward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found");
    err.title = "Resource not Found";
    err.errors = { message: "The Requested resource couldn't be found" };
    err.status = 404;
    next(err);
});

//Process Sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
      err.errors = err.errors.map((error) => error.message);
      err.title = 'Validation error';
    }
    next(err);
  });

//Error Formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});

module.exports = app;

// Imports -- External
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { ValidationError } = require('sequelize');
require('express-async-errors');

// Imports -- Internal
const { environment } = require('./config');
const routes = require('./routes');


const isProduction = environment === 'production';

// Initialize app
const app = express();

// use all global middleware
app.use(morgan('dev'));  // logging

// converts json req bodies into parsed objects attached to req.body
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
    app.use(cors());
}

app.use(helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
})
);

app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// Routes
app.use(routes);

// Error handling middleware
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err.errors);
});

app.use((err, _req, _res, next) => {
    console.log(err.errors, "we are here")
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = 'Validation error';
        err.errors = errors;
    }
    next(err);
});

app.use((err, _req, res, _next) => {  // error formatter
    res.status(err.status || 500);
    if (isProduction) {
        delete err.title;
        delete err.stack;
    }
    console.error(err);
    res.json({
        title: err.title,
        message: err.message,
        errors: err.errors,
        stack: err.stack   // edit later
    });
});

// Exports
module.exports = app;

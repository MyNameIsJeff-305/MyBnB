const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach(error => errors[error.path] = error.msg);

        const err = Error('bad request.');
        err.errors = errors;
        err.status = 400;
        err.title = "Bad Request.";
        next(err);
    }
    next();
}

module.exports = {
    handleValidationErrors
}

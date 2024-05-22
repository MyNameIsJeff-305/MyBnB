const router = require('express').Router();
const sessionRouter = require('./login.js');
const usersRouter = require('./users.js');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const csrf = require('csurf');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const bcrypt = require('bcryptjs');
const { User } = require('../../db/models');

// Routes_____________________________________________________

router.get('/:userId',requireAuth, async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.params.userId));

        res.json(currentUser || {"user": null});
    } catch (error) {
        next(error);
    }
})

module.exports = router;

const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Middlewares_____________________________

//Checking for a valid Login
const validateLogin = [
    
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
    handleValidationErrors
];

//Route Handlers__________________________________

//Log in

router.post('/', validateLogin, async (req, res, next) => {
    try {
        const { credential, password } = req.body;
    
        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential
                }
            }
        });
    
        if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
            const err = new Error('Login failed');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = { credential: 'The provided credentials were invalid.' };
            return next(err);
        }
    
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
    
        await setTokenCookie(res, safeUser);
    
        safeUser.firstName = user.firstName
        safeUser.lastName = user.lastName
    
        return res.json({
            user: safeUser
        });
    } catch (error) {
        next({
            message: 'Login error. (POST) backend/routes/api/session.js'
        })
    }
});

//Log out
router.delete('/', (_req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: 'success"' })
    } catch (error) {
        next({
            message: 'Logout error. (DELETE) backend/routes/api/session.js'
        })
    }
});

//Restore Session User
router.get('/', (req, res) => {
    try {
        const { user } = req;
        if (user) {
            const safeUser = {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName
            };
            return res.json({
                user: safeUser
            });
        } else return res.json({ user: null });
    } catch (error) {
        next(error)
    }
});

module.exports = router;

//Phase 4 Done
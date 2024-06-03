const router = require('express').Router();
const { requireAuth } = require('../../utils/auth.js');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { validateSignup, validateUser } = require('../../utils/validations')
const { Sequelize, where } = require('sequelize');

const bcrypt = require('bcryptjs');
const { setTokenCookie } = require('../../utils/auth');

//Get the current User
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.user.id));

        res.json({ user: currentUser } || { "user": null });
    } catch (error) {
        next(error);
    }
});

//Signup a User
router.post('/', validateSignup, async (req, res, next) => {
    // try block
    try {
        const userEmail = await User.findAll({
            where: {
                email: req.body.email
            }
        });

        for (const user of userEmail) {
            if (user.email === req.body.email)
                return res.status(500).json({
                    message: "User already exists",
                    errors: {
                        email: "User with that email already exists"
                    }
                });
        }

        const userUsername = await User.findAll({
            where: {
                username: req.body.username
            }
        });
        for (const user of userUsername) {
            if (user.username === req.body.username)
                return res.status(500).json({
                    message: "User already exists",
                    errors: {
                        username: "User with that username already exists"
                    }
                })
        }


        // deconstruct req.body
        const defaultPassword = 'password'
        const { email, password, username, firstName, lastName } = req.body;
        // // create a hashed password for user
        let hashedPassword;
        if (password)
            hashedPassword = bcrypt.hashSync(password);
        else
            hashedPassword = bcrypt.hashSync(defaultPassword)
        // // create user record in Users table
        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            hashedPassword: hashedPassword
        });

        // create safeUser object for setTokenCookie function
        const safeUser = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            username: newUser.username
        };
        // set token cookie
        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
        // forward any errors not already sent
    } catch (error) {
        next(error);
    };
});

module.exports = router;

const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie } = require('../../utils/auth');
const { User } = require('../../db/models/');

const { validateLogin } = require('../../utils/validation');

const router = express.Router();

//Route Handlers__________________________________

//Log in
router.post('/', validateLogin, async (req, res, next) => {
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
            firstName: user.firstName,
            lastName: user.lastName
        };

        await setTokenCookie(res, safeUser);
        return res.json({
            user: safeUser
        });
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

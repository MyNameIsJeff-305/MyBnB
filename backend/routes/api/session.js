const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie } = require('../../utils/auth');

const { validateLogin } = require('../../utils/validations');

//Route Handlers__________________________________
//Get the current User
router.get('/', async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.user.id));

        res.json({
            user: {
                id: currentUser.id,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                email: currentUser.email,
                username: currentUser.username
            }
        } || { user: null });
    } catch (error) {
        next(error);
    }
});

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
        return res.status(401).json({
            message: "Invalid Credentials"
        })
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
// router.get('/', (req, res) => {
//     try {
//         const { user } = req;
//         if (user) {
//             const safeUser = {
//                 id: user.id,
//                 email: user.email,
//                 username: user.username,
//                 firstName: user.firstName,
//                 lastName: user.lastName
//             };
//             return res.json({
//                 user: safeUser
//             });
//         } else return res.json({ user: null });
//     } catch (error) {
//         next(error)
//     }
// });

//Log out
router.delete('/', (_req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: 'success' })
    } catch (error) {
        next({
            message: 'Logout error. (DELETE) backend/routes/api/session.js'
        })
    }
});


module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Middleware for Validate Signup
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
]

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

// Routes_____________________________________________________

router.post('/', validateSignup, async (req, res) => {
    try {
        const { email, password, username } = req.body; //Deconstructing req.body

        const hashedPassword = bcrypt.hashSync(password); //Hashed password for User

        const user = await User.create({ email, username, hashedPassword }); //Creating User Record in Users Table
    
        const safeUser = { //This will be for the setTokenCookie functions
            id: user.id,
            email: user.email,
            username: user.username,
        };
    
        await setTokenCookie(res, safeUser); //Set Token Cookie
        
        //Adding First Name and Last Name to the Safe User
        safeUser.firstName = firstName;
        safeUser.lastName = lastName;

        return res.json({
            user: safeUser
        });
    } catch (error) {
        next(error)
    }
});

router.get('/:userId',requireAuth, async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.params.userId));

        res.json(currentUser || {"user": null});
    } catch (error) {
        next(error);
    }
})

router.post('/login', validateLogin, async (req, res, next) => {
    try {
        const { credential, password } = req.body;
        console.log('Here');
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
    
        await restoreUser(res, safeUser);
    
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

module.exports = router;

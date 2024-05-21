const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
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

router.get('/:userId', async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.params.userId));

        res.json(currentUser || null);
    } catch (error) {
        
    }
})

module.exports = router;

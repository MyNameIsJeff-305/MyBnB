const router = require('express').Router();
const sessionRouter = require('./login.js');
const usersRouter = require('./users.js');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const csrf = require('csurf');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const bcrypt = require('bcryptjs');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { Sequelize } = require('sequelize');

// Routes_____________________________________________________

//Get the current User
router.get('/:userId', requireAuth, async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.params.userId));

        res.json(currentUser || { "user": null });
    } catch (error) {
        next(error);
    }
});


//Get all Spots owned by the Current User
router.get('/me/spots', requireAuth, async (req, res, next) => {
    try {
        const Spots = await Spot.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                    [Sequelize.fn('', Sequelize.col('SpotImages.url')), 'previewImage']
                ],
            },
            where: {
                ownerId: req.user.id
            },
            group: ['Spot.id'],
            include: [
                {
                    model: Review,
                    attributes: []
                }, {
                    model: SpotImage,
                    attributes: [],
                }
            ]
        });
        res.json({ Spots })
    } catch (error) {
        next(error)
    }
});

//Get all Reviews of the Current User
router.get('/me/reviews', requireAuth, async (req, res, next) => {
    try {
        const Reviews = await Review.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('', Sequelize.col('ReviewImages.url')), 'previewImage']
                ]
            },
            where: {
                userId: req.user.id
            },
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: [
                        'id',
                        'ownerId',
                        'address',
                        'city',
                        'state',
                        'country',
                        'lat',
                        'lng',
                        'name',
                        'price',
                    ],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                },
                {
                    model: ReviewImage,
                    attributes: []
                }
            ]
        });

        res.json({ Reviews });

    } catch (error) {
        next(error)
    }
})

module.exports = router;

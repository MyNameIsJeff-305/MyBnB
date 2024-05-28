const router = require('express').Router();
const { requireAuth } = require('../../utils/auth.js');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { Sequelize } = require('sequelize');
const { validateLogin } = require('../../utils/validations.js');
const { includes } = require('lodash');

//Get the current User
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.user.id));

        res.json(currentUser || { "user": null });
    } catch (error) {
        next(error);
    }
});

//Get all Spots owned by the Current User
router.get('/me/spots', requireAuth, async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                    [Sequelize.fn('', Sequelize.col('SpotImages.url')), 'previewImage']
                ],
            },
            where: { ownerId: req.user.id },
            include: [{
                model: Review,
                attributes: []
            }, {
                model: SpotImage,
                attributes: ['url'],
            }]
        })
        res.json({ spots })
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
});

//Get all of the Current User's Bookings
router.get('/me/bookings', requireAuth, async (req, res, next) => {
    try {
        const Bookings = await Booking.findAll({
            include: {
                model: Spot,
                as: 'Spot',
                attributes: [
                    'id', 'ownerId', 'address', 'city', 'state',
                    'country', 'lat', 'lng', 'name', 'price'
                ],
                include: {
                    model: SpotImage,
                    as: 'previewImage',
                    attributes: ['url'],
                    where: { preview: true },
                    required: false
                }
            }
        });

        const formattedBookings = Bookings.map(booking => {
            const spot = booking.Spot.toJSON();
            spot.previewImage = spot.previewImage[0].url;
            return {
                id: booking.id,
                spotId: booking.spotId,
                Spot: spot,
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            }
        })

        res.json({ Bookings: formattedBookings })
    } catch (error) {
        next(error)
    }
})

module.exports = router;

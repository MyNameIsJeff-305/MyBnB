const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotValues, validateReviews, properUserValidation } = require('../../utils/validations');


//Get all Spots
router.get('/', async (_req, res, next) => {
    try {

        const spots = await Spot.findAll({
            attributes: {
                include: [
                    [(Sequelize.fn('AVG', Sequelize.col('Reviews.stars'))), 'avgRating'], //Check whether a Spot doesn't have reviews
                    [Sequelize.fn('', Sequelize.col('SpotImages.url')), 'previewImage']
                ],
            },
            group: ['Spot.id'],
            include: [
                {
                    model: Review,
                    attributes: []
                },
                {
                    model: SpotImage,
                    attributes: [],
                }]
        });


        res.json(spots);

    } catch (error) {
        next(error)
    }
});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);

        const spot = await Spot.findOne({
            where: {
                id: spotId,
            },
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
                    [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
                ],
            },
            include: [
                {
                    model: Review,
                    attributes: [], // Exclude review attributes since we're only interested in the count
                },
                {
                    model: SpotImage,
                    as: 'SpotImages', // Ensure this matches your association alias
                    attributes: ['id', 'url', 'preview'],
                    required: false,
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            group: ['Spot.id', 'SpotImages.id', 'Owner.id'],
        });

        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            err.title = 'Resource not found';
            err.errors = { query: 'Query returned an empty array (no resources like that)' };
            throw err;
        }

        const spotData = spot.toJSON();
        const previewImages = spotData.SpotImages.filter(image => image.preview).map(image => image.url);
        const formattedSpot = {
            ...spotData,
        };

        res.json(formattedSpot);
    } catch (error) {
        next(error);
    }
});

//Create a Spot
router.post('/', requireAuth, validateSpotValues, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({
            ownerId: parseInt(req.user.id),
            address: address,
            city: city,
            state: state,
            country: country,
            lat: lat,
            lng: lng,
            name: name,
            description: description,
            price: price
        })

        res.json(newSpot);

    } catch (error) {
        next(error)
    }
})

//Add an image to a Spot based on the Spot's Id
router.post('/:spotId/images', requireAuth, properUserValidation, async (req, res, next) => {
    try {
        const { url, preview } = req.body;

        const spotImages = await SpotImage.create({
            url: url,
            preview: preview,
            spotId: req.params.spotId
        })

        const safeSpotImage = await SpotImage.findAll({
            where: {
                id: spotImages.id
            },
            attributes: ['id', 'url', 'preview']
        });


        res.json(safeSpotImage)
    } catch (error) {
        next(error)
    }
});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpotValues, properUserValidation, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const spot = await Spot.findByPk(parseInt(req.params.spotId));

        if (!spot)
            return res.status(404).json({
                "message": "Spot couldn't be found"
            });

        await spot.update(
            {
                address: address,
                city: city,
                state: state,
                country: country,
                lat: lat,
                lng: lng,
                name: name,
                description: description,
                price: price
            },
            {
                where: {
                    id: req.params.spotId
                }
            }
        );


        res.json(spot)

    } catch (error) {
        next(error)
    }
});

//Delete a Spot
router.delete('/:spotId', requireAuth, properUserValidation, async (req, res, next) => {
    try {
        const spot = await Spot.findByPk(parseInt(req.params.spotId))

        if (!spot)
            return res.status(404).json({
                message: "Spot couldn't be found"
            });

        await spot.destroy();

        res.json({
            message: "Successfully deleted"
        })

    } catch (error) {
        next(error)
    }
});

//Get all Reviews by a Spot's Id
router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const Reviews = await Review.findAll({
            where: {
                spotId: req.params.spotId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        if (!Reviews)
            return res.status(404).json({
                message: "Spot couldn't be found"
            })

        res.json({ Reviews })
    } catch (error) {
        next(error)
    }
})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReviews, async (req, res, next) => {
    try {
        const { review, stars } = req.body;

        const spot = await Spot.findByPk(parseInt(req.params.spotId));

        if (!spot)
            return res.status(404).json(
                {
                    message: "Spot couldn't be found"
                });

        const spotReviews = await Review.findAll({
            where: {
                spotId: req.params.spotId
            }
        })

        for (const review of spotReviews) {
            if (review.userId === req.user.id)
                return res.status(500).json({
                    message: "User already has a review for this spot"
                })
        }

        const createdReview = await Review.create({
            userId: req.user.id,
            spotId: parseInt(req.params.spotId),
            review: review,
            stars: stars
        })

        res.json(createdReview);

    } catch (error) {

    }
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    try {

        const { spotId } = req.params;

        const Bookings = await Booking.findAll({
            where: {
                spotId: spotId
            }
        });

        const spot = await Spot.findAll({
            where: {
                id: parseInt(spotId)
            }
        })

        if (!spot)
            return res.status(404).json({
                message: "Spot couldn't be found"
            });

        if (spot[0].ownerId !== req.user.id) {
            const formattedBookings = Bookings.map(booking => {
                return {
                    spotId: booking.spotId,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                }
            });
            res.json({ Bookings: formattedBookings })
        } else {
            const formattedBookings = Bookings.map(booking => {
                const user = {
                    id: parseInt(req.user.id),
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                };
                return {
                    User: user,
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                }
            });
            res.json({ Bookings: formattedBookings })
        }

    } catch (error) {
        next(error)
    }
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        const spotId = parseInt(req.params.spotId);

        const spot = await Spot.findByPk(spotId)

        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            err.title = "Resource not Found";
            return next(err);
        }

        if (spot.ownerId === parseInt(req.user.id)) {
            const err = new Error("Owners cannot self-reserve")
            err.status = 403;
            err.title = "Unauthorized";
            return next(err);
        }

        const bookings = await Booking.findAll({
            where: {
                spotId: parseInt(req.params.spotId)
            }
        });

        const err = new Error("Sorry, this spot is already booked for the specified dates");
        err.status = 403;
        err.errors = {};
        for (const booking of bookings) {
            if(booking.startDate >= new Date(startDate) && booking.startDate <= new Date(endDate)) {
                err.errors.startDate = "Start date conflicts with an existing booking";
            }
            if(booking.endDate <= new Date(endDate) && booking.endDate >= new Date(startDate)) {
                err.errors.endDate = "End date conflicts with an existing booking";
            }
        }
        if(err.errors.startDate || err.errors.endDate){
            return next(err);}

        if (new Date(endDate) <= new Date(startDate)) {
            const err = new Error('Bad Request');
            err.status = 400
            err.errors = { 'endDate': "endDate cannot be on or before startDate" };
            return next(err)
        }

        const newBooking = await Booking.create({
            spotId: parseInt(req.params.spotId),
            userId: parseInt(req.user.id),
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        res.json(newBooking);

    } catch (error) {
        next(error)
    }
});

module.exports = router;

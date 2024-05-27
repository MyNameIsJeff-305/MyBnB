const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotValues, validateReviews, properUserValidation } = require('../../utils/validation')


//Get all Spots
router.get('/', async (_req, res, next) => {
    try {

        const spots = await Spot.findAll({
            attributes: {
                include: [
                    [(Sequelize.fn('AVG', Sequelize.col('Reviews.stars'))), 'avgRating'],
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
        const Bookings = await Booking.findAll({
            where: {
                spotId: req.params.spotId
            }
        });

        if()

        res.json({Bookings})

    } catch (error) {

    }
})

module.exports = router;

const router = require('express').Router();
const { Sequelize, where } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { groupBy, add } = require('lodash');
const { Op } = require('sequelize');
const { check } = require('express-validator');

//Middlewares
//Validate a Spot
const validateSpotValues = [
    check('address').exists({ checkFalsy: true }).withMessage("Street address is required"),
    check('city').exists({ checkFalsy: true }).withMessage("City is required"),
    check('state').exists({ checkFalsy: true }).withMessage("State is required"),
    check('country').exists({ checkFalsy: true }).withMessage("Country is required"),
    check('lat').exists({ checkFalsy: true }).isFloat().withMessage("Latitude is not valid"),
    check('lng').exists({ checkFalsy: true }).isFloat().withMessage("Longitude is not valid"),
    check('name').exists({ checkFalsy: true }).isLength(50).withMessage("Name must be less than 50 characters"),
    check('description').exists({ checkFalsy: true }).withMessage("Description is required"),
    check('price').exists({ checkFalsy: true }).withMessage("Price per day is required")
];

const properUserValidation = async (req, _res, next) => {
    const { id } = req.user;
    const { spotId } = req.params;
    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            err.title = 'Resource not found';
            return next(err);
        }

        // console.log(spot.ownerId, " ", id);
        if (spot.ownerId !== id) {
            const err = new Error('Unauthorized');
            err.status = 403;
            err.title = 'Forbidden';
            return next(err);
        }

        next();
    } catch (error) {//add 500 status
        next(error);
    }
};

//Get all Spots
router.get('/', async (_req, res, next) => {
    try {

        const spots = await Spot.findAll({
            attributes: {
                include: [
                    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
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

        res.json(spotImages)
    } catch (error) {
        next(error)
    }
});

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpotValues, properUserValidation, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const spot = await Spot.findByPk(parseInt(req.params.spotId));

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

        if (!spot)
            return res.status(404).json({
                "message": "Spot couldn't be found"
            });

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

        if(!Reviews)
            return res.status(404).json({
                message: "Spot couldn't be found"
              })

        res.json({ Reviews })
    } catch (error) {
        next(error)
    }
})

module.exports = router;

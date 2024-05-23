const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { groupBy } = require('lodash');
const { Op } = require('sequelize');

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

module.exports = router;
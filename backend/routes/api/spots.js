const router = require('express').Router();
const {Spot} = require('../../db/models');
const {Sequelize} = require('sequelize');
const {Review} = require('../../db/models');
const {SpotImage} = require('../../db/models');
const {requireAuth} = require('../../utils/auth')
const {User} = require('../../db/models')

//Get all Spots
router.get('/', async (_req, res, next)=>{
    try {

        const spots = await Spot.findAll({
            attributes: {
                include:[
                    [Sequelize.fn('AVG',Sequelize.col('Reviews.stars')),'avgRating'],
                    [Sequelize.fn('',Sequelize.col('SpotImages.url')),'previewImage']
                ],
            },
            group:['Spot.id'],
            include:[
                {
                model:Review,
                attributes:[]
            },
            {
                model:SpotImage,
                attributes:[],
            }]
        });

        
        res.json(spots);

    } catch (error) {
        next(error)
    }
});

//Get details of a Spot from an id
// router.get('/:spotId', async(req, res, next))

module.exports = router;
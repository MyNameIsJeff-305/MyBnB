const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotValues, validateReviews, properUserValidation, properReviewValidation } = require('../../utils/validation')

//Add an image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, properReviewValidation, async (req, res, next) => {
    try {
        const { url } = req.body;
    
        const review = await Review.findByPk(parseInt(req.params.reviewId));
    
        if (!review)
            return res.status(404).json({
                message: "Review couldn't be found"
            });
    
        const reviewCount = await ReviewImage.count({
            where: {
                reviewId: parseInt(req.params.reviewId)
            }
        });
    
        if (reviewCount >= 10)
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached"
            });
    
        const newReviewImage = await ReviewImage.create({
            url: url,
            reviewId: parseInt(req.params.reviewId)
        });

        const safeReviewImage = {
            id: newReviewImage.id,
            url: newReviewImage.url
        }

        res.json(safeReviewImage);

    } catch (error) {
        next(error)
    }

})

module.exports = router;
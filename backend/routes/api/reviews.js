const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotValues, validateReviews, properUserValidation, properReviewValidation } = require('../../utils/validations')

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

});

//Edit a Review
router.put('/:reviewId', requireAuth, properReviewValidation, validateReviews, async (req, res, next) => {
    try {
        const { review, stars } = req.body

        const updatedReview = await Review.findByPk(parseInt(req.params.reviewId));

        await updatedReview.update({
            review: review,
            stars: stars
        })

        res.json(updatedReview)
    } catch (error) {
        next(error)
    }
});

//Delete a Review
router.delete('/:reviewId', requireAuth, properReviewValidation, async (req, res, next) => {
    try {
        const review = await Review.findByPk(parseInt(req.params.reviewId))

        if (!review)
            return res.status(404).json({
                message: "Review couldn't be found"
            });

        await review.destroy();

        res.json({
            message: "Successfully deleted"
        })
    } catch (error) {
        next(error)
    }
});

module.exports = router;

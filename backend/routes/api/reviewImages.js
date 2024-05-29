const router = require('express').Router();
const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.delete('/:reviewImageId', requireAuth, async (req, res, next) => {
    try {
        const myReviewImage = await ReviewImage.findByPk(parseInt(req.params.reviewImageId));

        if (!myReviewImage) {
            return res.status(404).json({
                message: "Review Image couldn't be found"
            })
        };

        const review = await Review.findByPk(myReviewImage.reviewId);

        if (review.userId !== req.user.id) {
            const err = new Error("Review must belong to the current user");
            err.status = 403;
            err.title = "Forbidden";
            return next(err);
        }

        await myReviewImage.destroy();

        res.json({
            message: "Successfully deleted"
        });

    } catch (error) {
        next(error);
    }
})

module.exports = router;

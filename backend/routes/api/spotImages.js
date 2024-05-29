const router = require('express').Router();
const { SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//Delete a Spot Image
router.delete('/:spotImageId', requireAuth, async (req, res, next) => {
    try {
        const mySpotImage = await SpotImage.findByPk(parseInt(req.params.spotImageId));

        if (!mySpotImage) {
            return res.status(404).json({
                message: "Spot Image couldn't be found"
            })
        };

        const spot = await Spot.findByPk(mySpotImage.spotId);

        if (spot.ownerId !== req.user.id) {
            const err = new Error("Spot must belong to the current user");
            err.status = 403;
            err.title = "Forbidden";
            return next(err);
        }

        await mySpotImage.destroy();

        res.json({
            message: "Successfully deleted"
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;

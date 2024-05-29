const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotValues, validateReviews } = require('../../utils/validations');


router.put('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        const myBooking = await Booking.findByPk(parseInt(req.params.bookingId))

        if (!myBooking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
              })
        }

        if (myBooking.userId !== parseInt(req.user.id)) {
            const err = new Error("Booking must belong to the current user");
            err.status = 403;
            err.title = "Forbidden";
            return next(err)
        }

        if (new Date(endDate) <= new Date(startDate)) {
            const err = new Error('Validation Error ');
            err.status = 400;
            err.message = "Bad Request"
            err.errors = { endDate: "endDate cannot be on or before startDate" }
            return next(err)
        }

        if (new Date(endDate) <= new Date(Date.now())) {
            return res.status(403).json({ 
                message: "Past bookings can't be modified" 
            })
        }

        const bookings = await Booking.findAll({
            where: {
                spotId: parseInt(myBooking.spotId)
            }
        });

        for (const booking of bookings) {
            
        }

        await myBooking.update({
            startDate: startDate,
            endDate: endDate
        });

        res.json(myBooking)

    } catch (error) {
        next(error)
    }
})



module.exports = router;
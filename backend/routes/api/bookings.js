const router = require('express').Router();
const { Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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

        const err = new Error("Sorry, this spot is already booked for the specified dates");
        err.status = 403;
        err.errors = {};

        for (const booking of bookings) {
            if (new Date(booking.startDate) >= new Date(startDate) && new Date(booking.startDate) <= new Date(endDate)) {
                err.errors.startDate = "Start date conflicts with an existing booking";
            }
            if (new Date(booking.endDate) <= new Date(endDate) && new Date(booking.endDate) >= new Date(startDate)) {
                err.errors.endDate = "End date conflicts with an existing booking";
            }
        }

        if (err.errors.startDate || err.errors.endDate) {
            return next(err);
        }

        await myBooking.update({
            startDate: startDate,
            endDate: endDate
        });

        res.json(myBooking)

    } catch (error) {
        next(error)
    }
});

//Delete a Booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const myBooking = await Booking.findByPk(parseInt(req.params.bookingId))

        if (!myBooking) {
            return res.status(404).json({
                message: "Booking couldn't be found"
            })
        }

        if (myBooking.startDate <= new Date(Date.now())) {
            return res.status(403).json({
                message: "Bookings that have been started can't be deleted"
            })
        }

        if (myBooking.userId !== parseInt(req.user.id)) {
            const err = new Error("Booking must belong to the current user");
            err.status = 403;
            err.title = "Forbidden";
            return next(err)
        }

        await myBooking.destroy();

        res.json({
            message: "Successfully deleted"
        })

    } catch (error) {
        next(error)
    }
});

module.exports = router;

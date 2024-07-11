const router = require('express').Router();
const { Sequelize, Op } = require('sequelize');
const { SpotImage, Spot, User, Review, ReviewImage, Booking } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { validateSpotValues, validateReviews, properUserValidation, validateQueryValues, handleValidationErrors } = require('../../utils/validations');


//Get all Spots
router.get('/', validateQueryValues, async (req, res, next) => {
    try {
        //Parse page and size values
        const { maxLat, minLat, maxLng, minLng, minPrice, maxPrice } = req.query;

        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 20;

        //Declare where
        const where = {};

        //Latitude Filter
        if (minLat)
            where.lat = { [Op.gte]: parseFloat(minLat) };
        if (maxLat)
            where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };

        //Longitude Filter
        if (minLng)
            where.lng = { [Op.gte]: parseFloat(minLng) };
        if (maxLng)
            where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };

        //Price Filter
        if (minPrice)
            where.price = { [Op.gte]: parseFloat(minPrice) };
        if (maxPrice)
            where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

        const spots = await Spot.findAll({
            where,
            limit: size,
            offset: (page - 1) * size
        });

        let Spots = [];

        for (const spot of spots) {
            spot.lat = parseFloat(spot.lat);
            spot.lng = parseFloat(spot.lng);
            spot.price = parseFloat(spot.price);
            const values = spot.toJSON();
            Spots.push(values);
        }

        const reviews = await Review.findAll();

        let average = {};

        for (const review of reviews) {
            let values = review.toJSON();
            if (!average[values.spotId]) {
                average[values.spotId] = {
                    spotId: values.spotId,
                    cumulTotal: values.stars,
                    amountReviews: 1
                }
                // console.log("THIS IS AVG OBJECT", ` ${values.spotId} ` , average[values.spotId]);
            }
            else {
                average[values.spotId].total = average[values.spotId].cumulTotal + values.stars;
                average[values.spotId].amountReviews++;
            }
            // console.log("AVERAGE", average);
        }

        let ratings = {};

        for (const rating in average) {
            // console.log("THIS IS RATING", ratings);
            ratings[average[rating].spotId] = average[rating].total / average[rating].amountReviews
        }

        const previewImages = await SpotImage.findAll({
            where: {
                preview: true
            }
        });

        let previews = {};

        for (const previewImage of previewImages) {
            let image = previewImage.toJSON();
            previews[image.spotId] = image.url;
        }

        for (const spot of Spots) {
            spot.avgRating = ratings[spot.id];
            spot.previewImage = previews[spot.id]
        }

        res.json({ Spots, page: +page, size: +size });
    }
    catch (error) {
        next(error)
    }
});

//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
            where: {
                ownerId: parseInt(req.user.id)
            }
        })

        let Spots = [];
        let avgReviews = {};
        let previewImages = {};

        for (const spot of spots) {
            const values = spot.toJSON();
            Spots.push(values);

            const reviews = await Review.findAll({
                where: {
                    spotId: spot.id
                }
            });
            let totalStars = 0
            let count = 0
            for (const review of reviews) {
                totalStars += review.stars;
                count++
            }
            avgReviews[spot.id] = totalStars / count;

            const previews = await SpotImage.findAll({
                where: {
                    spotId: spot.id
                }
            });

            for (const preview of previews) {
                if (preview.preview)
                    previewImages[spot.id] = preview.url
            }
        }

        for (const spot of Spots) {
            spot.lat = parseFloat(spot.lat);
            spot.lng = parseFloat(spot.lng);
            spot.price = parseFloat(spot.price);
            spot.avgRating = avgReviews[spot.id];
            spot.previewImage = previewImages[spot.id]
        }

        res.json({ Spots })
    } catch (error) {
        next(error)
    }
});

//Get details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    try {

        const spot = await Spot.findByPk(parseInt(req.params.spotId));

        if (!spot) {
            res.status(404).json({
                message: "Spot couldn't be found"
            })
        }

        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            }
        });

        let numReviews = 0;
        let sumStars = 0
        for (const review of reviews) {
            sumStars += review.stars;
            numReviews++
        }
        let avg = sumStars / numReviews;

        const images = await SpotImage.findAll({
            where: {
                spotId: spot.id
            },
            attributes: ['id', 'url', 'preview']
        })

        const owner = await User.findByPk(spot.ownerId);

        spot.SpotImages = images;
        spot.Owner = owner;
        spot.lat = parseFloat(spot.lat);
        spot.lng = parseFloat(spot.lng);
        spot.price = parseFloat(spot.price);

        res.json({
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            numReviews: numReviews,
            avgStarRating: avg,
            SpotImages: images,
            Owner: owner
        });
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
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            name: name,
            description: description,
            price: parseFloat(price)
        })

        res.status(201).json(newSpot);

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


        res.status(201).json({
            id: safeSpotImage[0].id,
            url: safeSpotImage[0].url,
            preview: safeSpotImage[0].preview
        })
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
                spotId: parseInt(req.params.spotId)
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

        if (!Reviews || Reviews.length === 0)
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

        res.status(201).json(createdReview);

    } catch (error) {

    }
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    try {

        const { spotId } = req.params;



        const Bookings = await Booking.findAll({
            where: {
                spotId: spotId
            }
        });

        const spot = await Spot.findAll({
            where: {
                id: parseInt(spotId)
            }
        });


        if (spot.length === 0)
            return res.status(404).json({
                message: "Spot couldn't be found"
            });

        if (spot[0].ownerId !== req.user.id) {
            const formattedBookings = Bookings.map(booking => {
                return {
                    spotId: booking.spotId,
                    startDate: booking.startDate,
                    endDate: booking.endDate
                }
            });
            res.json({ Bookings: formattedBookings })
        } else {
            const formattedBookings = Bookings.map(booking => {
                const user = {
                    id: parseInt(req.user.id),
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
                };
                return {
                    User: user,
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    createdAt: booking.createdAt,
                    updatedAt: booking.updatedAt
                }
            });
            res.json({ Bookings: formattedBookings })
        }

    } catch (error) {
        next(error)
    }
});

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;

        const spotId = parseInt(req.params.spotId);

        const spot = await Spot.findByPk(spotId)

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found"
            });
        }

        if (spot.ownerId === parseInt(req.user.id)) {
            return res.status(403).json({
                message: "Owners cannot self-reserve"
            })
        }

        const bookings = await Booking.findAll({
            where: {
                spotId: parseInt(req.params.spotId)
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

        if (new Date(endDate) <= new Date(startDate)) {
            const err = new Error('Bad Request');
            err.status = 400
            err.errors = { endDate: "endDate cannot be on or before startDate" };
            return next(err)
        }

        if(new Date(startDate) >= new Date(endDate)) {
            const err = new Error('Bad Request');
            err.status = 400
            err.errors = { endDate: "startDate cannot be on or before endDate" };
            return next(err);
        }

        const newBooking = await Booking.create({
            spotId: parseInt(req.params.spotId),
            userId: parseInt(req.user.id),
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });

        res.status(201).json(newBooking);

    } catch (error) {
        next(error)
    }
});

module.exports = router;

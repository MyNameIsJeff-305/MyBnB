const router = require('express').Router();
const { requireAuth } = require('../../utils/auth.js');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');
const { validateSignup } = require('../../utils/validations')
const { Sequelize, where } = require('sequelize');

//Get the current User
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const currentUser = await User.findByPk(parseInt(req.user.id));

        res.json({ user: currentUser } || { "user": null });
    } catch (error) {
        next(error);
    }
});

//Get all Spots owned by the Current User
router.get('/me/spots', requireAuth, async (req, res, next) => {
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
            spot.avgRating = avgReviews[spot.id];
            spot.previewImage = previewImages[spot.id]
        }

        res.json({ Spots })
    } catch (error) {
        next(error)
    }
});

//Get all Reviews of the Current User
router.get('/me/reviews', requireAuth, async (req, res, next) => {
    try {
        const reviews = await Review.findAll({
            where: {
                userId: req.user.id
            },
        });

        let Reviews = [];

        for (const review of reviews) {
            let value = review.toJSON();

            const spot = await Spot.findByPk(review.spotId);
            const user = await User.findByPk(req.user.id);
            const reviewImages = await ReviewImage.findAll({
                where: {
                    reviewId: review.id
                }
            });

            let imgs = reviewImages.map(reviewImage => ({
                id: reviewImage.id,
                url: reviewImage.url
            }));

            const previewImage = await SpotImage.findOne({
                where: {
                    spotId: review.spotId,
                    preview: true
                }
            });

            Reviews.push({
                ...value,
                User: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                Spot: {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    price: spot.price,
                    previewImage: previewImage ? previewImage.url : null
                },
                ReviewImages: imgs
            });
        }

        res.json({ Reviews });
    } catch (error) {
        next(error);
    }
});

//Get all of the Current User's Bookings
router.get('/me/bookings', requireAuth, async (req, res, next) => {
    try {
        const bookings = await Booking.findAll({
            where: {
                userId: parseInt(req.user.id)
            }
        });

        const formattedBookings = [];

        for (const booking of bookings) {

            const spot = await Spot.findByPk(booking.spotId);

            const previewImage = await SpotImage.findOne({
                where: {
                    spotId: spot.id,
                    preview: true
                }
            });

            formattedBookings.push({
                id: booking.id,
                spotId: booking.spotId,
                Spot: {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat: spot.lat,
                    lng: spot.lng,
                    name: spot.name,
                    price: spot.price,
                    previewImage: previewImage.url
                },
                userId: booking.userId,
                startDate: booking.startDate,
                endDate: booking.endDate,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt
            })
        }

        res.json({ Bookings: formattedBookings })
    } catch (error) {
        next(error)
    }
});

router.post('/users', validateSignup, async (req, res, next) => {
    // try block
    try {
        // deconstruct req.body
        const defaultPassword = 'password'
        const { email, password, username, firstName, lastName } = req.body;
        // // create a hashed password for user
        let hashedPassword;
        if (password)
            hashedPassword = bcrypt.hashSync(password);
        else
            hashedPassword = bcrypt.hashSync(defaultPassword)
        // // create user record in Users table
        const newUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            username: username,
            hashedPassword: hashedPassword
        });
        console.log(newUser);
        // create safeUser object for setTokenCookie function
        const safeUser = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            username: newUser.username
        };
        // set token cookie
        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser
        });
        // forward any errors not already sent
    } catch (error) {
        next(error);
    };
});

module.exports = router;

const router = require('express').Router();
const { Booking, SpotImage, Spot } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


module.exports = router;

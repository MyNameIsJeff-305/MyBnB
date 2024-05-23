const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models/');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//Log out
router.delete('/', (_req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: 'success"' })
    } catch (error) {
        next({
            message: 'Logout error. (DELETE) backend/routes/api/session.js'
        })
    }
});

module.exports = router;
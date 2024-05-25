const express = require('express');

const router = express.Router();

//Log out
router.delete('/', (_req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: 'success' })
    } catch (error) {
        next({
            message: 'Logout error. (DELETE) backend/routes/api/session.js'
        })
    }
});

module.exports = router;

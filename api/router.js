const express = require('express');
// global express router
const router = express.Router();

// Api routes
router.get('/', function (req, res) {
    return res.redirect(307, '/api/v1/');
});

// API versions
router.use('/v1', require('./v1/router'));


module.exports = router;
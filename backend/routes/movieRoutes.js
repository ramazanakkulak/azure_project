const express = require('express');
const cinema = require('../controllers/movie');
const authProtect = require('../middleware/middleware');
const router = express.Router();

router.post('/create', cinema.movieCreate);
router.get('/data', cinema.getMovie);
module.exports = router;

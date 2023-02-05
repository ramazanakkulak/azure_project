const express = require('express');
const user = require('../controllers/user');
const authProtect = require('../middleware/middleware');
const router = express.Router();

router.post('/register', user.register);
router.post('/login', user.login);
router.post('/status', user.status);
module.exports = router;

const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
const validate = require('../validations/user');

router.post('/register', validate.register, authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/refresh_token', authController.generateAccessToken);

module.exports = router;

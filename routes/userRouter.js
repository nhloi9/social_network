const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const validate = require('../validations/user');
const auth = require('../middleware/auth');

router.get('/search', auth, userController.search);
router.get('/:id', auth, userController.getUser);
router.put('/', auth, userController.updateUser);
router.put('/follow/:id', auth, userController.follow);
router.put('/unfollow/:id', auth, userController.unfollow);
// router.post('/login', authController.login);
// router.get('/logout', authController.logout);
// router.post('/refresh_token', authController.generateAccessToken);

module.exports = router;

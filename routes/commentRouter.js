const express = require('express');
const commentController = require('../controllers/comment');
const router = express.Router();
const validate = require('../validations/user');
const auth = require('../middleware/auth');

router.post('/', auth, commentController.create);
router.put('/:id', auth, commentController.update);
router.delete('/:id', auth, commentController.delete);
router.put('/:id/like', auth, commentController.like);
router.put('/:id/unlike', auth, commentController.unlike);

module.exports = router;

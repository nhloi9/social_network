const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ConverSationController = require('../controllers/conversation');

router.post('/', auth, ConverSationController.create);
router.get('/', auth, ConverSationController.getAll);
router.get('/:id', auth, ConverSationController.getSingle);
router.put('/:id/seen', auth, ConverSationController.seen);

module.exports = router;

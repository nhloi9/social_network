const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/message');

router.post('/', auth, messageController.create);
router.get('/conversation/:id', auth, messageController.getMessages);

module.exports = router;

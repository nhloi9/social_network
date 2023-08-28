const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notify');
const auth = require('../middleware/auth');
// const validate = require('../validations/user.js');

router.post('/', auth, notifyController.create);
router.get('/', auth, notifyController.getAllByUser);
router.put('/:id/read', auth, notifyController.read);
router.delete('/sender/deleteAll', auth, notifyController.deleteBySender);
router.delete('/', auth, notifyController.deleteAll);

module.exports = router;

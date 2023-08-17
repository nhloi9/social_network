const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const postSaveSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'user',
	},
	post: {
		type: mongoose.Types.ObjectId,
		ref: 'post',
	},
});

module.exports = mongoose.model('post_Save', postSaveSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const postLikeSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'user',
	},
	post: {
		type: String,
		ref: 'post',
	},
});

module.exports = mongoose.model('post_like', postLikeSchema);

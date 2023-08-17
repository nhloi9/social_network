const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const commentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'user',
		},
		post: {
			type: mongoose.Types.ObjectId,
			ref: 'post',
		},
		content: String,

		reply: {
			type: mongoose.Types.ObjectId,
			ref: 'comment',
		},
		tag: {
			type: mongoose.Types.ObjectId,
			ref: 'user',
		},

		likes: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'user',
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('comment', commentSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const notifySchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Types.ObjectId,
			ref: 'user',
		},
		receiver: {
			type: mongoose.Types.ObjectId,
			ref: 'user',
		},

		target: {type: mongoose.Types.ObjectId, refPath: 'module'},
		module: {
			type: String,
			required: true,
			enum: ['post'],
		},
		url: {
			type: String,
		},
		text: {
			type: String,
		},
		image: {
			type: String,
		},
		isRead: {type: Boolean, default: false},
		content: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('notify', notifySchema);

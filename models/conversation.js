const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
	{
		members: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'user',
			},
		],
		seen: {type: [Boolean], default: [false, false]},
		lastMessage: {type: Object},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('conversation', conversationSchema);

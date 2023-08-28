const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
	{
		sender: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
		receiver: {type: mongoose.Types.ObjectId, ref: 'user', required: true},
		text: {type: String},
		media: Array,
		conversation: {
			type: mongoose.Types.ObjectId,
			ref: 'conversation',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('message', messageSchema);

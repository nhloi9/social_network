const error = require('../error/error');
const Message = require('../models/message');
const ConverSation = require('../models/conversation');
const {queryFeature} = require('../utils/queryFeature');
const messageController = {
	create: async (req, res, next) => {
		console.log(req.body);
		try {
			const {receiver, text, media, conversation} = req.body;
			if (!text?.trim() && !media)
				return next(new error('Invalid parameters', 400));
			const message = await Message.create({
				sender: req.user._id,
				receiver,
				text,
				media,
				conversation,
			});
			const existConversation = await ConverSation.findOne({_id: conversation});
			const index = existConversation.members.indexOf(req.user._id);
			existConversation.seen = index ? [false, true] : [true, false];
			existConversation.text = text;
			existConversation.media = media;
			await existConversation.save();
			return res.status(200).json({message});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getMessages: async (req, res, next) => {
		try {
			const conversation = await ConverSation.findById(req.params.id);
			if (conversation?.members.includes(req.user._id)) {
				const query = new queryFeature(
					Message.find({conversation: req.params.id}).sort({createdAt: -1}),
					req.query
				).pagination();
				const messages = await query;
				res.status(200).json({messages});
			} else next(new error('Conversation not found'));
		} catch (err) {
			next(new error(err.message, 500));
		}
	},
};

module.exports = messageController;

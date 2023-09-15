const error = require('../error/error');
const Conversation = require('../models/conversation');
const conversationController = {
	create: async (req, res, next) => {
		try {
			// const {tag, reply, content, post} = req.body;
			// const ConverSation = await ConverSation.create({
			// 	tag,
			// 	reply,
			// 	content,
			// 	user: req.user._id,
			// 	post,
			// });
			let conversation = await Conversation.findOne({
				members: {$all: [req.user._id, req.body.other]},
			});
			if (!conversation) {
				console.log(req.body.other);
				conversation = await Conversation.create({
					members: [req.user._id, req.body.other],
				});
			}

			return res.status(201).json({
				msg: 'ConverSation created successfully',
				conversation,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getAll: async (req, res, next) => {
		try {
			const conversations = await Conversation.find({
				members: req.user._id,
				lastMessage: {$exists: true},
			})
				.populate('members', '_id avatar username fullname')
				.sort({'lastMessage.createdAt': -1});

			return res.status(201).json({
				conversations,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getSingle: async (req, res, next) => {
		try {
			const conversation = await Conversation.findById(req.params.id).populate(
				'members',
				'_id avatar username fullname'
			);

			return res.status(201).json({
				conversation,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	seen: async (req, res, next) => {
		try {
			await Conversation.findByIdAndUpdate(req.params.id, {seen: [true, true]});
			return res.status(201).json({
				msg: 'success',
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
};

module.exports = conversationController;

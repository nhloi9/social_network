const error = require('../error/error');
const Notify = require('../models/notify');

const notifyController = {
	create: async (req, res, next) => {
		try {
			const {receiver, target, module, text, url, image, content} = req.body;
			const notifies = [];
			for (item of receiver) {
				if (req.user._id.equals(item)) return;
				const notifyData = {
					receiver: item,
					target,
					module,
					text,
					url,
					image,
					content,
					sender: req.user._id,
				};
				const notify = await Notify.findOneAndUpdate(
					notifyData,
					{
						$set: {
							...notifyData,
							createdAt: new Date(),
							isRead: false,
						},
					},
					{
						upsert: true,
						returnDocument: 'after',
					}
				);
				notifies.push(notify);
			}
			// const notifies = await Notify.create(array);
			res.status(201).json({
				msg: 'success',
				notifies,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getAllByUser: async (req, res, next) => {
		try {
			const notifies = await Notify.find({receiver: req.user._id})
				.populate({
					path: 'sender',
					select: '_id username avatar',
				})
				.sort({createdAt: -1});
			res.status(200).json({msg: 'success', notifies});
		} catch (err) {
			next(new error(err.message, 500));
		}
	},
	read: async (req, res, next) => {
		try {
			// console.log(req.body);
			const notify = await Notify.findOneAndUpdate(
				{
					_id: req.params.id,
				},
				{
					$set: {
						isRead: true,
					},
				},
				{
					returnDocument: 'after',
				}
			);
			res.status(200).json({
				msg: 'success',
				notify,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	deleteBySender: async (req, res, next) => {
		try {
			await Notify.deleteMany({
				sender: req.user._id,
				target: req.query.target,
				text: req.query.text,
			});
			return res.status(200).json({msg: 'success'});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	deleteAll: async (req, res, next) => {
		try {
			await Notify.deleteMany({receiver: req.user._id});
			res.status(201).json({
				msg: 'success',
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
};

module.exports = notifyController;

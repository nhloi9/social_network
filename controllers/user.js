const error = require('../error/error');
const User = require('../models/user');

const userController = {
	search: async (req, res, next) => {
		try {
			const {term} = req.query;
			const users = await User.find({
				_id: {$ne: req.user._id},
				$or: [
					{username: {$regex: term.trim(), $options: 'i'}},
					{
						fullname: {$regex: term.trim().replace(/\s\s+/g, ' '), $options: 'i'},
					},
				],
			}).select('avatar fullname username');
			return res.status(200).json({users: users, msg: 'Success'});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getUser: async (req, res, next) => {
		try {
			const {id} = req.params;
			const user = await User.findById(id)
				// .select({email: false, mobile: false})
				.populate({path: 'following'})
				.populate({path: 'followers'});
			if (!user) {
				return next(new error('user not found', 404));
			}
			return res.status(200).json({
				msg: 'Success',
				user,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},

	updateUser: async (req, res, next) => {
		try {
			await User.findByIdAndUpdate(
				req.user._id,
				{$set: req.body},
				{returnDocument: 'after'}
			);
			let user = await User.findById(req.user._id).populate(
				'followers',
				'following'
			);
			if (!user) {
				return next(new error('user not found', 404));
			}
			return res.status(200).json({
				msg: 'Success',
				user,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	follow: async (req, res, next) => {
		try {
			const id = req.params.id;
			const other = await User.findById(id);
			if (!other) {
				return next(new error('user not found', 404));
			}
			const user = req.user;
			if (!user.following.includes(id)) {
				user.following.push(id);
			}
			await User.updateOne(
				{_id: id},
				{
					$addToSet: {
						followers: user._id,
					},
				}
			);
			await user.save();
			res.status(200).json({
				msg: 'Followed successfully',
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	unfollow: async (req, res, next) => {
		try {
			const id = req.params.id;
			const other = await User.findById(id);
			if (!other) {
				return next(new error('user not found', 404));
			}
			const user = req.user;
			if (user.following.includes(id)) {
				user.following.splice(user.following.indexOf(id), 1);
			}
			await User.updateOne(
				{_id: id},
				{
					$pullAll: {
						followers: [user._id],
					},
				}
			);
			await user.save();
			res.status(200).json({
				msg: 'Unfollowed successfully',
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
};

module.exports = userController;

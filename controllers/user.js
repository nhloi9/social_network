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
					// {
					// 	username: {
					// 		$regex: {
					// 			query: term.trim(),
					// 			allowAnalyzedField: true,
					// 		},
					// 	},
					// },
					// // {
					{fullname: {$regex: term.trim().replace(/\s\s+/g, ' '), $options: 'i'}},
					// },
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
			// console.log(req.body);
			const id = req.params.id;
			const other = await User.findById(id);
			if (!other) {
				return next(new error('user not found', 404));
			}
			// const user = req.user;
			// console.log(user.toObject());
			// if (user.following.every(item => item.toString()!==id)) {
			// 	user.following.push(id);
			// }
			await User.updateOne(
				{_id: req.user._id},
				{
					$addToSet: {
						following: id,
					},
				}
			);
			await User.updateOne(
				{_id: id},
				{
					$addToSet: {
						followers: req.user._id,
					},
				}
			);
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
			await User.updateOne(
				{_id: req.user._id},
				{
					$pull: {
						following: id,
					},
				}
			);
			await User.updateOne(
				{_id: id},
				{
					$pullAll: {
						followers: [req.user._id],
					},
				}
			);
			res.status(200).json({
				msg: 'Unfollowed successfully',
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	suggest: async (req, res, next) => {
		try {
			let suggestUser = await User.aggregate([
				{$match: {_id: {$nin: [...req.user.following, req.user._id]}}},
				{$sample: {size: req.query.num || 5}},
				{
					$lookup: {
						from: 'users',
						localField: 'following',
						foreignField: '_id',
						as: 'followingData',
					},
				},
			]);
			if (!suggestUser) {
				return next(new error('user not found', 404));
			}

			return res.status(200).json({
				msg: 'Success',
				suggestUser,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
};

module.exports = userController;

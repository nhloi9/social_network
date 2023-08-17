const error = require('../error/error');
const PostLike = require('../models/post_like');
const postLikeController = {
	create: async (req, res, next) => {
		try {
			const exitLike = await PostLike.findOne({
				user: req.user._id,
				post: req.params.id,
			});
			if (exitLike) return next(new error('already like', 400));
			const like = await PostLike.create({
				user: req.user._id,
				post: req.params.id,
			});
			return res.status(201).json({
				msg: 'Like created successfully',
				like,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	delete: async (req, res, next) => {
		try {
			const like = await PostLike.findOneAndDelete({
				user: req.user._id,
				post: req.params.id,
			});
			// console.log(like);
			if (!like) return next(new error('not found', 404));
			return res.status(201).json({
				msg: 'Like deleted successfully',
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
};

module.exports = postLikeController;

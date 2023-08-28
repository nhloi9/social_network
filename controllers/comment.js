const error = require('../error/error');
// const comment = require('../models/comment');
const Comment = require('../models/comment');
const commentController = {
	create: async (req, res, next) => {
		try {
			const {tag, reply, content, post} = req.body;
			const comment = await Comment.create({
				tag,
				reply,
				content,
				user: req.user._id,
				post,
			});
			return res.status(201).json({
				msg: 'Comment created successfully',
				comment,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	update: async (req, res, next) => {
		try {
			const {content} = req.body;

			const updatedComment = await Comment.findOneAndUpdate(
				{
					_id: req.params.id,
					user: req.user._id,
				},
				{
					$set: {
						content,
					},
				},
				{
					returnDocument: 'after',
				}
			);
			if (comment) {
				return res.status(200).json({
					msg: 'Comment updated successfully',
					comment: updatedComment,
				});
			} else return next(new error('not found', 500));
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	delete: async (req, res, next) => {
		try {
			const comment = await Comment.findById(req.params.id).populate('post');
			console.log({commentUser: comment.user, user: req.user._id});
			if (
				comment.user.equals(req.user._id) ||
				comment.post.user.equals(req.user._id)
			) {
				await Comment.findOneAndDelete({
					_id: req.params.id,
				});
				return res.status(200).json({
					msg: 'Comment deleted successfully',
				});
			} else
				return next(new error('you are not allowed to delete this comment', 400));
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	like: async (req, res, next) => {
		try {
			const comment = await Comment.findOneAndUpdate(
				{_id: req.params.id},
				{$addToSet: {likes: req.user._id}},
				{returnDocument: 'after'}
			);
			if (comment) {
				return res.status(200).json({
					msg: 'like comment successfully',
					comment,
				});
			} else {
				next(new error('not found', 400));
			}
		} catch (err) {
			next(new error(err.message, 500));
		}
	},
	unlike: async (req, res, next) => {
		try {
			const comment = await Comment.findOneAndUpdate(
				{_id: req.params.id},
				{$pullAll: {likes: [req.user._id]}},
				{returnDocument: 'after'}
			);
			if (comment) {
				return res.status(200).json({
					msg: 'unlike comment successfully',
					comment,
				});
			} else {
				next(new error('not found', 400));
			}
		} catch (err) {
			next(new error(err.message, 500));
		}
	},
};

module.exports = commentController;

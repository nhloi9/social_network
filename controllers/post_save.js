const error = require('../error/error');
// const comment = require('../models/comment');
const PostSave = require('../models/post_save');
const postSaveController = {
	create: async (req, res, next) => {
		try {
			const exitSave = await PostSave.findOne({
				user: req.user._id,
				post: req.params.id,
			});
			if (exitSave) return next(new error('already saved', 400));
			const save = await PostSave.create({
				user: req.user._id,
				post: req.params.id,
			});
			return res.status(201).json({
				msg: 'You saved this post ',
				save,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	delete: async (req, res, next) => {
		try {
			const save = await PostSave.findOneAndDelete({
				user: req.user._id,
				post: req.params.id,
			});
			// console.log(Save);
			if (!save) return next(new error("you haven't saved this post yet", 404));
			return res.status(201).json({
				msg: 'Unsave successfully',
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getSavedPosts: async (req, res, next) => {
		try {
			const posts = await PostSave.aggregate([
				{
					$match: {user: req.user._id},
				},
				{
					$lookup: {
						from: 'posts',
						localField: 'post',
						foreignField: '_id',
						as: 'postData',
					},
				},
				{
					$replaceRoot: {
						newRoot: {$mergeObjects: ['$$ROOT', {$arrayElemAt: ['$postData', 0]}]},
					},
				},
				{
					$lookup: {
						from: 'comments',
						localField: '_id',
						foreignField: 'post',
						as: 'comments',
					},
				},
				{
					$lookup: {
						from: 'post_likes',
						localField: '_id',
						foreignField: 'post',
						as: 'likes',
					},
				},
				{
					$project: {
						postData: 0,
					},
				},
			]);
			res.status(200).json({
				msg: 'Success',
				posts,
			});
		} catch (err) {
			next(new error(err.message, 500));
		}
	},
};

module.exports = postSaveController;

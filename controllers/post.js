const error = require('../error/error');
const Post = require('../models/post');
const PostLike = require('../models/post_like');
const Comment = require('../models/comment');
const {queryFeature} = require('../utils/queryFeature');
const post = require('../models/post');
const postController = {
	create: async (req, res, next) => {
		try {
			const {content, images} = req.body;
			const post = await Post.create({content, images, user: req.user._id});
			return res.status(201).json({
				msg: 'Post created successfully',
				post,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getPosts: async (req, res, next) => {
		try {
			// console.log({body: req.body, query: req.query});

			const user = req.user;
			const query = Post.find({
				user: {$in: [...user.following, user._id]},
			}).sort({createdAt: -1});

			const clone = query.clone();
			const posts = await new queryFeature(query, req.query)
				.pagination()
				.populate({path: 'user'})
				.populate({path: 'likes', select: '-_id', populate: {path: 'user'}})
				.populate({
					path: 'comments',
					populate: {path: 'user tag likes'},
				});
			return res.status(200).json({
				msg: 'Successfully',
				posts: posts,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	update: async (req, res, next) => {
		try {
			const {content, images} = req.body;
			const exitPost = await Post.findById(req.params.id);
			if (!exitPost) {
				return next(new error('post not found', 404));
			}
			if (exitPost.user.toString() !== req.user._id.toString()) {
				return next(new error('you are not allowed to update this post'), 400);
			}
			const post = await Post.findOneAndUpdate(
				{
					_id: req.params.id,
				},
				{$set: {content, images}},
				{
					returnDocument: 'after',
				}
			);
			// .populate({
			// 	path: 'user likes',
			// 	// select: 'fullname username avatar',
			// 	// select all fields
			// });
			return res.status(201).json({
				msg: 'Post updated successfully',
				post,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	// createComment: async (req, res, next) => {
	// 	console.log(req.body);
	// 	try {
	// 		const {content, reply, tag} = req.body;
	// 		const comment = await Comment.create({
	// 			user: req.user._id,
	// 			post: req.params.id,
	// 			content,
	// 			reply,
	// 			tag,
	// 		});
	// 		return res.status(201).json({
	// 			msg: 'Comment created successfully',
	// 			comment,
	// 		});
	// 	} catch (error) {
	// 		return next(new error(err.message, 500));
	// 	}
	// },

	getUserPosts: async (req, res, next) => {
		try {
			const id = req.params.id;
			const posts = await Post.find({
				user: id,
			})
				.sort({createdAt: -1})
				// .populate({path: 'user'})
				.populate({path: 'likes', select: '-_id', populate: {path: 'user'}})
				.populate({
					path: 'comments',
					populate: {path: 'user tag likes'},
				});
			return res.status(200).json({
				msg: 'Successfully',
				posts: posts,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},

	getPost: async (req, res, next) => {
		try {
			const id = req.params.id;
			const post = await Post.findById(id)
				.populate({path: 'user'})
				.populate({path: 'likes', select: '-_id', populate: {path: 'user'}})
				.populate({
					path: 'comments',
					populate: {path: 'user tag likes'},
				});
			if (post == null) {
				return next(new error('not found', 404));
			} else {
				return res.status(200).json({
					msg: 'Successfully',
					post: post,
				});
			}
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	getPostsDiscover: async (req, res, next) => {
		try {
			// console.log({body: req.body, query: req.query});

			const user = req.user;
			const query = Post.find({
				user: {$nin: [...user.following, user._id]},
			}).sort({createdAt: -1});
			const clone = query.clone();
			const posts = await new queryFeature(query, req.query)
				.pagination()
				.populate({path: 'user'})
				.populate({path: 'likes', select: '-_id', populate: {path: 'user'}})
				.populate({
					path: 'comments',
					populate: {path: 'user tag likes'},
				});
			return res.status(200).json({
				msg: 'Successfully',
				posts: posts,
				totalPage: Math.ceil((await clone.countDocuments()) / req.query.limit) || 0,
			});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	delete: async (req, res, next) => {
		try {
			const {id} = req.params;
			const post = await Post.findOneAndDelete({_id: id, user: req.user._id});
			if (post)
				return res.status(201).json({
					msg: 'Post deleted successfully',
					post,
				});
			else
				return res.status(404).json({
					msg: 'not found',
					post,
				});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
};

module.exports = postController;

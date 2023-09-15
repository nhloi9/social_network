import {socket} from '../../socket';
import {
	deleteDataApi,
	getDataApi,
	postDataAPI,
	putDataAPI,
} from '../../utils/fetchData';
import {upload} from '../../utils/imageUpload';
import {GLOBALTYPES, removeFromArray, updateArray} from './globalTypes';
import {createNotify, deleteNotifiesBySender} from './notifyAction';

export const POST_TYPES = {
	CREATE: 'CREATE_POST',
	GET_POSTS_REQUEST: 'GET_POSTS_REQUEST',
	GET_POSTS_SUCCESS: 'GET_POSTS_SUCCESS',
	GET_POSTS_FAIL: 'GET_POSTS_FAIL',
	CLEAR: 'CLEAR',
	UPDATE_POST_REQUEST: 'UPDATE_POST_REQUEST',
	UPDATE_POST_SUCCESS: 'UPDATE_POST_SUCCESS',
	UPDATE_POST_FAIL: 'UPDATE_POST_FAIL',
	LIKE_POST: 'LIKE_POST',
	UPDATE_POST: 'UPDATE_POST',
	GET_POST: 'GET_POST',
	DELETE_POST: 'DELETE_POST',
	// RECEIVE_COMMENT: 'RECEIVE_COMMENT',
};

export const createPost =
	({content, photos}) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					loading: true,
				},
			});
			// console.log({photos});
			const images = await upload(photos);
			// console.log(content);
			// console.log(images);
			const res = await postDataAPI('/post', {
				images: images.map((image) => ({
					url: image.secure_url,
					public_id: image.public_id,
				})),
				content,
			});
			dispatch({
				type: POST_TYPES.CREATE,
				payload: {
					...res?.data?.post,
					user: getState().auth.user,
					likes: [],
					comments: [],
				},
			});
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					success: res?.data?.msg,
				},
			});
			const msg = {
				receiver: getState().auth.user.followers.map((user) => user._id),
				target: res.data.post._id,
				module: 'post',
				url: `/post/${res.data.post._id}`,
				text: 'added a new post',
				image: images[0].secure_url,
				content,
			};
			dispatch(createNotify(msg));
			socket.emit(
				'join_post',
				// res.data.posts.map((post) => post._id)
				[res?.data.post._id]
			);
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				error: err,
			});
		}
	};

export const receiveComment = (comment) => (dispatch, getState) => {
	const post = getState().homePost.posts.find(
		(item) => item._id === comment.post
	);
	dispatch({
		type: POST_TYPES.UPDATE_POST,
		payload: {...post, comments: [...post.comments, comment]},
	});
};

export const getPosts =
	(page = 1) =>
	async (dispatch) => {
		try {
			dispatch({
				type: POST_TYPES.GET_POSTS_REQUEST,
			});
			const res = await getDataApi(`/post?page=${page}&&limit=6`);
			socket.emit(
				'join_post',
				res.data.posts.map((post) => post._id)
			);
			dispatch({
				type: POST_TYPES.GET_POSTS_SUCCESS,
				payload: res.data.posts,
			});
		} catch (error) {
			dispatch({
				type: POST_TYPES.GET_POSTS_FAIL,
				payload: error.response?.data?.msg,
			});
		}
	};
export const updatePost =
	({content, photos, post}) =>
	async (dispatch, getState) => {
		try {
			// dispatch({
			// 	type: POST_TYPES.UPDATE_POST_REQUEST,
			// });
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					loading: true,
				},
			});
			const newPhotos = photos.filter((photo) => !photo.url);
			const oldPhotos = photos.filter((photo) => photo.url);
			// console.log({newPhotos, oldPhotos});
			// console.log({content, photos});
			if (
				content === post.content &&
				oldPhotos.length === post.images.length &&
				newPhotos.length === 0
			)
				return;
			let newImages = [];
			if (newPhotos.length > 0) {
				newImages = (await upload(newPhotos)).map((photo) => ({
					url: photo.secure_url,
					public_id: photo.public_id,
				}));
			}
			// console.log({
			// 	images: [...oldPhotos, ...newImages],
			// });
			const res = await putDataAPI(`post/${post._id}`, {
				content,
				images: [...oldPhotos, ...newImages],
			});
			// const res = await getDataApi('/post');
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					success: res.data.msg,
				},
			});
			// dispatch({
			// 	type: POST_TYPES.UPDATE_POST_SUCCESS,
			// 	payload: {...post, content, images: [...oldPhotos, ...newImages]},
			// });
			dispatch({
				type: POST_TYPES.UPDATE_POST,
				payload: {...post, content, images: [...oldPhotos, ...newImages]},
			});
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err.res?.data?.msg,
				},
			});
			dispatch({
				type: POST_TYPES.UPDATE_POST_FAIL,
				payload: err.response?.data?.msg,
			});
		}
	};

export const likePost = (post) => async (dispatch, getState) => {
	try {
		socket.emit('like', {post: post._id, user: getState().auth.user});

		const {data} = await putDataAPI(`/post/${post._id}/like`);
		const newPost = {
			...post,
			likes: [
				...post.likes,
				{
					user: getState().auth.user,
				},
			],
		};

		dispatch({
			type: POST_TYPES.UPDATE_POST,
			payload: newPost,
		});

		const msg = {
			receiver: [post.user],
			target: data?.like?._id,
			module: 'post_like',
			url: `/post/${post._id}`,
			text: 'like your post',
			image: post.images[0]?.secure_url,
			content: '',
		};

		dispatch(createNotify(msg));
	} catch (err) {
		console.log(err);
	}
};

export const unlikePost = (post) => async (dispatch, getState) => {
	try {
		socket.emit('unlike', post._id, getState().auth.user._id);

		await putDataAPI(`/post/${post._id}/unlike`);
		const newPost = {
			...post,
			likes: post.likes.filter(
				(like) => like.user._id !== getState().auth.user._id
			),
		};

		dispatch({
			type: POST_TYPES.UPDATE_POST,
			payload: newPost,
		});
	} catch (err) {
		console.log(err);
	}
};

export const createComment =
	({content, post, commentRep}) =>
	async (dispatch, getState) => {
		try {
			// console.log({content, post, commentRep});
			let newComment = {
				content,
				user: getState().auth.user,
				tag: commentRep?.user,
				createdAt: new Date().toISOString(),
				likes: [],
				reply: commentRep
					? commentRep.reply
						? commentRep.reply
						: commentRep._id
					: undefined,
				post: post._id,
			};

			dispatch({
				type: POST_TYPES.UPDATE_POST,
				payload: {...post, comments: [...post.comments, newComment]},
			});
			const {data} = await postDataAPI(`/comment`, {
				content,
				reply: commentRep
					? commentRep.reply
						? commentRep.reply
						: commentRep._id
					: undefined,
				tag: commentRep?.user._id,
				post: post._id,
			});
			newComment = {...newComment, _id: data.comment._id};

			const newPost = {
				...post,
				comments: [...post.comments, newComment],
			};
			socket.emit('comment', newComment);
			const msg = {
				// sender: getState().auth.user._id,
				receiver: [commentRep ? commentRep.user._id : post.user._id],
				target: data.comment._id,
				module: 'comment',
				url: `/post/${post._id}`,
				text: commentRep ? 'mentioned you in a comment.' : 'commented on your post',
				image: post.images[0].url,
				content,
			};
			dispatch(createNotify(msg));

			dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost});
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err.response?.data?.msg,
				},
			});
		}
	};

export const likeComment = (comment, post) => async (dispatch, getState) => {
	try {
		await putDataAPI(`/comment/${comment._id}/like`);
		const newComment = {
			...comment,
			likes: [...comment.likes, getState().auth.user],
		};
		const newPost = {
			...post,
			comments: updateArray(post.comments, newComment),
		};

		dispatch({
			type: POST_TYPES.UPDATE_POST,
			payload: newPost,
		});
	} catch (err) {
		console.log(err);
	}
};
export const unlikeComment = (comment, post) => async (dispatch, getState) => {
	try {
		await putDataAPI(`/comment/${comment._id}/unlike`);
		const newComment = {
			...comment,
			likes: removeFromArray(comment.likes, getState().auth.user),
		};
		const newPost = {
			...post,
			comments: updateArray(post.comments, newComment),
		};

		dispatch({
			type: POST_TYPES.UPDATE_POST,
			payload: newPost,
		});
	} catch (err) {
		console.log(err);
	}
};

export const updateComment =
	(comment, post, content) => async (dispatch, getState) => {
		try {
			const newComment = {
				...comment,
				content: content,
			};
			let newPost = {
				...post,
				comments: updateArray(post.comments, {...newComment, updating: true}),
			};

			dispatch({
				type: POST_TYPES.UPDATE_POST,
				payload: newPost,
			});

			await putDataAPI(`/comment/${comment._id}`, {
				content,
			});

			newPost = {
				...post,
				comments: updateArray(post.comments, newComment),
			};

			dispatch({
				type: POST_TYPES.UPDATE_POST,
				payload: newPost,
			});
		} catch (err) {
			console.log(err);
		}
	};

export const deleteComment = (comment, post) => async (dispatch, getState) => {
	try {
		await deleteDataApi(`/comment/${comment._id}`);

		const msg = {
			sender: comment.user._id,
			target: comment._id,
			receiver: [comment.tag ? comment.tag._id : post.user._id],
			text: comment.tag ? 'mentioned you in a comment.' : 'commented on your post',
		};
		dispatch(deleteNotifiesBySender(msg));
		const newPost = {
			...post,
			comments: removeFromArray(post.comments, comment),
		};

		dispatch({
			type: POST_TYPES.UPDATE_POST,
			payload: newPost,
		});
	} catch (err) {
		console.log(err);
	}
};

export const getPost =
	({id}) =>
	async (dispatch, getState) => {
		try {
			if (getState().detailPost.every((item) => item._id !== id)) {
				const res = await getDataApi(`/post/${id}`);
				dispatch({type: POST_TYPES.GET_POST, payload: res.data.post});
			}
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err.response?.data?.msg,
				},
			});
		}
	};

//delete post
export const deletePost = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				loading: true,
			},
		});
		const res = await deleteDataApi(`post/${id}`);
		dispatch({
			type: POST_TYPES.DELETE_POST,
			payload: id,
		});
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				success: res.data.msg,
			},
		});
		const msg = {
			sender: getState().auth.user._id,
			target: id,
			receiver: getState().auth.user.followers.map((user) => user._id),
			text: 'added a new post',
		};
		dispatch(deleteNotifiesBySender(msg));
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error: err.res?.data?.msg,
			},
		});
	}
};

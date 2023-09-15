import {getDataApi, putDataAPI} from '../../utils/fetchData';
import {GLOBALTYPES, addToArray, removeFromArray} from './globalTypes';
import {upload} from '../../utils/imageUpload';
import {socket} from '../../socket';
import {createNotify} from './notifyAction';
export const PROFILE_TYPES = {
	LOADING: 'LOANGING_PROFILE',
	GET_USER: 'GET_PROFILE_USER',
	UPDATE_USER: 'UPDATE_PROFILE_USER',
	UPDATE_USER_REQUEST: 'UPDATE_PROFILE_USER_REQUEST',
	UPDATE_USER_SUCCESS: 'UPDATE_PROFILE_USER_SUCCESS',
	UPDATE_USER_FAIL: 'UPDATE_PROFILE_USER_FAIL',
	CLEAR_SUCCESS: 'CLEAR_PROFILE_USER_SUCCESS',
	FOLLOW: 'FOLLOW',
	UNFOLLOW: 'UNFOLLOW',
	LOADING_FOLLOW: 'LOADING_FOLLOW',
	GET_USER_POSTS: 'GET_USER_POSTS',
	GET_ID: 'GET_PROFILE_ID',
};

export const getProfileUsers =
	({id, auth}) =>
	async (dispatch) => {
		try {
			dispatch({
				type: PROFILE_TYPES.LOADING,
				payload: true,
			});
			const [res, res2] = await Promise.all([
				getDataApi(`user/${id}`),
				getDataApi(`post/user_posts/${id}`),
			]);
			dispatch({
				type: PROFILE_TYPES.GET_USER,
				payload: res.data.user,
			});
			dispatch({
				type: PROFILE_TYPES.GET_USER_POSTS,
				payload: {posts: res2.data.posts, _id: id},
			});

			dispatch({type: PROFILE_TYPES.GET_ID, payload: id});
			dispatch({
				type: PROFILE_TYPES.LOADING,
				payload: false,
			});
		} catch (err) {
			dispatch({
				type: PROFILE_TYPES.LOADING,
				payload: false,
			});
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err?.response?.data.msg,
				},
			});
		}
	};

// export const refresh_token = () => async (dispatch) => {
// 	try {
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {
// 				loading: true,
// 			},
// 		});
// 		const res = await postDataAPI('refresh_token');
// 		dispatch({
// 			type: GLOBALTYPES.AUTH,
// 			payload: res.data,
// 		});
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {},
// 		});
// 	} catch (err) {
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {},
// 		});
// 	}
// };

// export const register = (data) => async (dispatch) => {
// 	try {
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {
// 				loading: true,
// 			},
// 		});
// 		const res = await postDataAPI('register', data);
// 		dispatch({
// 			type: GLOBALTYPES.AUTH,
// 			payload: res.data,
// 		});
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {
// 				success: res.data.msg,
// 			},
// 		});
// 	} catch (err) {
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {
// 				error: err?.response?.data.msg,
// 			},
// 		});
// 	}
// };

// export const logout = () => async (dispatch) => {
// 	try {
// 		const res = await getDataApi('logout');

// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {
// 				success: res.data.message,
// 			},
// 		});
// 		dispatch({
// 			type: GLOBALTYPES.AUTH,
// 			payload: {},
// 		});
// 		// window.location.href = '/';
// 	} catch (err) {
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {
// 				error: err?.response?.data.msg,
// 			},
// 		});
// 	}
// };

export const updateProfileUser =
	({userData, image}) =>
	async (dispatch, getState) => {
		try {
			dispatch({
				type: PROFILE_TYPES.UPDATE_USER_REQUEST,
			});
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					loading: true,
				},
			});
			let avatar;
			if (image) {
				avatar = (await upload([image]))[0].secure_url;
			}

			const res = await putDataAPI(`user`, {...userData, avatar});

			dispatch({
				type: GLOBALTYPES.USER,
				payload: res.data.user,
			});
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					success: res.data.msg,
				},
			});
			dispatch({
				type: PROFILE_TYPES.UPDATE_USER_SUCCESS,
			});
		} catch (err) {
			dispatch({
				type: PROFILE_TYPES.UPDATE_USER_FAIL,
			});
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err?.response?.data.msg || err?.response?.data?.error?.message,
				},
			});
		}
	};
export const follow =
	({user, other}) =>
	async (dispatch, getState) => {
		try {
			dispatch({type: PROFILE_TYPES.LOADING_FOLLOW, payload: other._id});
			await putDataAPI(`user/follow/${other._id}`, null);
			socket.emit('follow', user, other._id);
			socket.emit('check_online', [other._id]);

			let newOther = getState().profile.users.find(
				(item) => item._id === other._id
			);
			if (newOther) {
				newOther = {...newOther, followers: addToArray(newOther.followers, user)};
				dispatch({
					type: PROFILE_TYPES.FOLLOW,
					payload: newOther,
				});
			}
			const msg = {
				receiver: [other._id],
				target: other._id,
				module: '',
				url: `/profile/${user._id}`,
				text: 'followed you ',
				image: '',
				content: '',
			};
			dispatch(createNotify(msg));
			dispatch({
				type: GLOBALTYPES.USER,
				payload: {...user, following: addToArray(user.following, other)},
			});
			dispatch({type: PROFILE_TYPES.LOADING_FOLLOW, payload: false});
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err?.response?.data.msg,
				},
			});
			dispatch({type: PROFILE_TYPES.LOADING_FOLLOW, payload: false});
		}
	};
export const unfollow =
	({user, other}) =>
	async (dispatch, getState) => {
		socket.emit('unfollow', getState().auth.user._id, other._id);
		try {
			dispatch({type: PROFILE_TYPES.LOADING_FOLLOW, payload: other._id});

			await putDataAPI(`user/unfollow/${other._id}`, null);
			// const newOther = {
			// 	...other,
			// 	followers: removeFromArray(other.followers, user),
			// };

			// dispatch({
			// 	type: PROFILE_TYPES.UNFOLLOW,
			// 	payload: newOther,
			// });
			let newOther = getState().profile.users.find(
				(item) => item._id === other._id
			);
			if (newOther) {
				newOther = {
					...newOther,
					followers: removeFromArray(newOther.followers, user),
				};
				dispatch({
					type: PROFILE_TYPES.UNFOLLOW,
					payload: newOther,
				});
			}
			dispatch({
				type: GLOBALTYPES.USER,
				payload: {...user, following: removeFromArray(user.following, other)},
			});
			dispatch({
				type: GLOBALTYPES.OFFLINE,
				payload: other._id,
			});
			dispatch({type: PROFILE_TYPES.LOADING_FOLLOW, payload: false});
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err?.response?.data.msg,
				},
			});
			dispatch({type: PROFILE_TYPES.LOADING_FOLLOW, payload: false});
		}
	};

// export const getUserPosts = (userId) => async (dispatch, getState) => {
// 	try {
// 		const posts = await getDataApi(`/user_posts/${userId}`);
// 		dispatch({
// 			type: PROFILE_TYPES.GET_USER_POSTS,
// 			payload: {
// 				userId,
// 				posts,
// 			},
// 		});
// 	} catch (err) {
// 		dispatch({
// 			type: GLOBALTYPES.ALERT,
// 			payload: {
// 				error: err?.response?.data.msg,
// 			},
// 		});
// 	}
// };

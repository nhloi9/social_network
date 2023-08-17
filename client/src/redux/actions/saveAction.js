import {deleteDataApi, getDataApi, postDataAPI} from '../../utils/fetchData';
import {GLOBALTYPES} from './globalTypes';
export const SAVE_TYPES = {
	SAVE: 'SAVE_POST',
	UNSAVE: 'UNSAVE_POST',
	GET_SAVE: 'GET_SAVE_POSTS",',
};

export const savePost = (post) => async (dispatch, getState) => {
	try {
		await postDataAPI(`post/${post.id}/save`);
		dispatch({type: SAVE_TYPES.SAVE, payload: post});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error: err?.response?.data.msg,
			},
		});
	}
};

export const unsavePost = (post) => async (dispatch, getState) => {
	try {
		await deleteDataApi(`post/${post.id}/unsave`);
		dispatch({type: SAVE_TYPES.UNSAVE, payload: post});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error: err?.response?.data.msg,
			},
		});
	}
};

export const getSavePosts = () => async (dispatch, getState) => {
	try {
		const {data} = await getDataApi('/post/save/list');
		dispatch({type: SAVE_TYPES.GET_SAVE, payload: data.posts});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error: err.response?.data?.msg,
			},
		});
	}
};

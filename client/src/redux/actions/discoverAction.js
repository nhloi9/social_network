import {getDataApi} from '../../utils/fetchData';
import {GLOBALTYPES} from './globalTypes';
export const DISCOVER_TYPES = {
	GET_POSTS_REQUEST: 'GET_DISCOVER_POSTS_REQUEST',
	GET_POSTS_SUCCESS: 'GET_DISCOVER_POSTS_SUCCESS',
	GET_POSTS_FAIL: 'GET_DISCOVER_POSTS_FAIL',
};

export const getDiscoverPosts =
	(page = 1) =>
	async (dispatch) => {
		try {
			dispatch({
				type: DISCOVER_TYPES.GET_POSTS_REQUEST,
			});
			const {data} = await getDataApi(`/post/discover/list?page=${page}&&limit=6`);
			dispatch({
				type: DISCOVER_TYPES.GET_POSTS_SUCCESS,
				payload: data,
			});
		} catch (err) {
			dispatch({
				type: DISCOVER_TYPES.GET_POSTS_FAIL,
				payload: err.response.data.msg,
			});
			dispatch({
				type: GLOBALTYPES.ALERT,
				payload: {
					error: err?.response?.data.msg,
				},
			});
		}
	};

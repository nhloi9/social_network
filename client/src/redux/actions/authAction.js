import {getDataApi, postDataAPI} from '../../utils/fetchData';
import {GLOBALTYPES} from './globalTypes';

export const login = (data) => async (dispatch) => {
	try {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				loading: true,
			},
		});
		const res = await postDataAPI('login', data);
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: res.data,
		});
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				success: res.data.msg,
			},
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error: err?.response?.data.msg,
			},
		});
	}
};

export const refresh_token = () => async (dispatch) => {
	try {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				loading: true,
			},
		});
		const res = await postDataAPI('refresh_token');
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: res.data,
		});
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {},
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {},
		});
	}
};

export const register = (data) => async (dispatch) => {
	try {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				loading: true,
			},
		});
		const res = await postDataAPI('register', data);
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: res.data,
		});
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				success: res.data.msg,
			},
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error: err?.response?.data.msg,
			},
		});
	}
};

export const logout = () => async (dispatch) => {
	try {
		const res = await getDataApi('logout');

		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				success: res.data.message,
			},
		});
		dispatch({
			type: GLOBALTYPES.AUTH,
			payload: {},
		});
		// window.location.href = '/';
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			payload: {
				error: err?.response?.data.msg,
			},
		});
	}
};

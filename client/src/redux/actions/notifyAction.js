import {socket} from '../../socket';
import {
	deleteDataApi,
	getDataApi,
	postDataAPI,
	putDataAPI,
} from '../../utils/fetchData';
import {GLOBALTYPES} from './globalTypes';

export const NOTIFY_TYPES = {
	CREATE: 'CREATE_NOTIFY',
	GET_ALL: 'GET_NOTIFIES',
	READ: 'READ_NOTIFY',
	ADD: 'ADD_NOTIFY',
	DELETEBYSENDER: 'DELETE_NOTIFY_BY_SENDER',
	PERMISSION: 'PERMISSION_NOTIFY',
	SOUND: 'SOUND_NOTIFY',
};

export const createNotify = (msg) => async (dispatch, getState) => {
	try {
		const res = await postDataAPI('notify', msg);
		const notifies = res.data.notifies.map((notify) => {
			return {
				...notify,
				sender: {
					_id: getState().auth.user._id,
					avatar: getState().auth.user.avatar,
					username: getState().auth.user.username,
				},
			};
		});
		socket.emit('notify', notifies);
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			error: err,
		});
	}
};
export const getNotifies = () => async (dispatch, getState) => {
	try {
		const res = await getDataApi('/notify');
		dispatch({type: NOTIFY_TYPES.GET_ALL, payload: res.data.notifies});
	} catch (err) {
		console.log(err);
	}
};

export const readNotify = (notify) => async (dispatch, getState) => {
	try {
		await putDataAPI(`notify/${notify._id}/read`);
		dispatch({type: NOTIFY_TYPES.READ, payload: {...notify, isRead: true}});
	} catch (error) {
		console.log(error);
	}
};

export const deleteNotifiesBySender = (msg) => async (dispatch, getState) => {
	try {
		await deleteDataApi(
			`/notify/sender/deleteAll?target=${msg.target}&text=${msg.text}`
		);
		socket.emit('deleteBySender', msg);
	} catch (error) {}
};

export const deleteAllNotifies = () => async (dispatch, getState) => {
	try {
		await deleteDataApi(`/notify`);
		dispatch({type: NOTIFY_TYPES.GET_ALL, payload: []});
	} catch (err) {
		dispatch({type: GLOBALTYPES.ALERT, payload: {error: err}});
	}
};

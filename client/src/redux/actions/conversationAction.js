import {socket} from '../../socket';
import {getDataApi, postDataAPI} from '../../utils/fetchData';
import {GLOBALTYPES} from './globalTypes';

export const CONVERSATION_TYPES = {
	ACTIVE_CONVERSATION: 'ACTIVE_CONVERSATION',
	CREATE_MESSAGE: 'CREATE_MESSAGE',

	GET_MESSAGES: 'GET_MESSAGES',
	ADD_CHAT: 'ADD_CHAT',
	GET_CONVERSATIONS: 'GET_CONVERSATIONS',
};

export const createConversation = (other) => async (dispatch, getState) => {
	try {
		const res = await postDataAPI(`conversation`, {other});
		const activeConversation = {
			_id: res.data.conversation._id,
			other,
		};
		dispatch({
			type: CONVERSATION_TYPES.ACTIVE_CONVERSATION,
			payload: activeConversation,
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			error: err,
		});
	}
};
export const createMessage = (message) => async (dispatch, getState) => {
	try {
		const res = await postDataAPI(`message`, message);
		// const chat = getState().conversation.chats.find(chat=> chat._id ===message.conversation);
		// const newChat = {...chat, messages: [...chat.messages, res.data.message]}
		socket.emit('message', res.data.message);
		dispatch({
			type: CONVERSATION_TYPES.CREATE_MESSAGE,
			payload: res.data.message,
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			error: err,
		});
	}
};

export const addChat = (conversationId) => async (dispatch, getState) => {
	if (
		getState().conversation.chats.find((chat) => chat._id === conversationId)
	) {
		return;
	}
	try {
		const res = await getDataApi(`message/conversation/${conversationId}`);
		// const chat = getState().conversation.chats.find(chat=> chat._id ===message.conversation);
		// const newChat = {...chat, messages: [...chat.messages, res.data.message]}

		dispatch({
			type: CONVERSATION_TYPES.ADD_CHAT,
			payload: {_id: conversationId, messages: res.data.messages},
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			error: err,
		});
	}
};

export const getConversations = () => async (dispatch, getState) => {
	try {
		const res = await getDataApi(`conversation`);
		// const chat = getState().conversation.chats.find(chat=> chat._id ===message.conversation);
		// const newChat = {...chat, messages: [...chat.messages, res.data.message]}

		dispatch({
			type: CONVERSATION_TYPES.GET_CONVERSATIONS,
			payload: res.data.conversations,
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			error: err,
		});
	}
};

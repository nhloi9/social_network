import {socket} from '../../socket';
import {getDataApi, postDataAPI} from '../../utils/fetchData';
import {GLOBALTYPES} from './globalTypes';

export const CONVERSATION_TYPES = {
	ACTIVE_CONVERSATION: 'ACTIVE_CONVERSATION',
	// CREATE_MESSAGE: 'CREATE_MESSAGE',
	GET_MESSAGES: 'GET_MESSAGES',
	ADD_CHAT: 'ADD_CHAT',
	GET_CONVERSATIONS: 'GET_CONVERSATIONS',
	UPDATE_CHAT: 'UPDATE_CHAT',
	UPDATE_CONVERSATION_SORT: 'UPDATE_CONVERSATION',
	ADD_CONVERSATION: 'ADD_CONVERSATION',
	SORT_CONVERSATIONS: 'SORT_CONVERSATIONS',
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
		const res = await postDataAPI(`message`, {
			...message,
			sender: message.sender._id,
			receiver: message.receiver._id,
		});
		// const chat = getState().conversation.chats.find(chat=> chat._id ===message.conversation);
		// const newChat = {...chat, messages: [...chat.messages, res.data.message]}
		socket.emit('message', {
			...res.data.message,
			sender: message.sender,
			receiver: message.receiver,
		});

		//update chat
		const chat = getState().conversation.chats.find(
			(item) => item._id === message.conversation
		);
		if (chat)
			dispatch({
				type: CONVERSATION_TYPES.UPDATE_CHAT,
				payload: {...chat, messages: [res.data.message, ...chat.messages]},
			});

		//update conversation
		const conversation = getState().conversation.conversations.find(
			(item) => item._id === message.conversation
		);
		const user = getState().auth.user;

		if (conversation) {
			const index = conversation.members.indexOf(
				conversation.members.find((member) => member._id === user._id)
			);

			dispatch({
				type: CONVERSATION_TYPES.UPDATE_CONVERSATION_SORT,
				payload: {
					...conversation,
					text: message.text,
					media: message.media || [],
					seen: index ? [false, true] : [true, false],
				},
			});
		} else {
			const newConversation = {
				_id: message.conversation,
				members: [message.sender, message.receiver],
				text: message.text,
				media: message.media,
				seen: [true, false],
			};
			dispatch({
				type: CONVERSATION_TYPES.ADD_CONVERSATION,
				payload: newConversation,
			});
		}
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

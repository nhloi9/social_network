import {socket} from '../../socket';
import {getDataApi, postDataAPI, putDataAPI} from '../../utils/fetchData';
import {GLOBALTYPES} from './globalTypes';

export const CONVERSATION_TYPES = {
	ACTIVE_CONVERSATION: 'ACTIVE_CONVERSATION',
	// CREATE_MESSAGE: 'CREATE_MESSAGE',
	GET_MESSAGES: 'GET_MESSAGES',
	ADD_CHAT: 'ADD_CHAT',
	GET_CONVERSATIONS: 'GET_CONVERSATIONS',
	UPDATE_CHAT: 'UPDATE_CHAT',
	UPDATE_CONVERSATION_SORT: 'UPDATE_CONVERSATION_SORT',
	UPDATE_CONVERSATION: 'UPDATE_CONVERSATION',

	ADD_CONVERSATION: 'ADD_CONVERSATION',
	SORT_CONVERSATIONS: 'SORT_CONVERSATIONS',
};

export const createConversation = (other) => async (dispatch, getState) => {
	try {
		const user = getState().auth.user;
		let activeConversation;
		let conversation = getState().conversation.conversations.find((item) =>
			item.members.find((member) => member._id === other._id)
		);
		if (!conversation) {
			const res = await postDataAPI(`conversation`, {other: other._id});
			activeConversation = {
				_id: res.data.conversation._id,
				other,
			};
			dispatch({
				type: CONVERSATION_TYPES.ADD_CONVERSATION,
				payload: {
					...res.data.conversation,
					members: [
						{
							_id: user._id,
							username: user.username,
							fullname: user.fullname,
							avatar: user.avatar,
						},
						other,
					],
				},
			});
		} else {
			activeConversation = {_id: conversation._id, other};
			dispatch(seenConversation(activeConversation._id, other._id));
		}
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
		const user = getState().auth.user;
		const chat = getState().conversation.chats.find(
			(item) => item._id === message.conversation
		);
		const messages = chat?.messages;
		if (chat)
			dispatch({
				type: CONVERSATION_TYPES.UPDATE_CHAT,
				payload: {
					...chat,
					messages: [
						{
							...message,
							sender: message.sender._id,
							receiver: message.receiver._id,
							createdAt: new Date(),
						},
						...messages,
					],
				},
			});
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
		if (chat)
			dispatch({
				type: CONVERSATION_TYPES.UPDATE_CHAT,
				payload: {...chat, messages: [res.data.message, ...chat.messages]},
			});

		//update conversation
		const conversation = getState().conversation.conversations.find(
			(item) => item._id === message.conversation
		);
		const index = conversation.members.findIndex(
			(member) => member._id === user._id
		);

		dispatch({
			type: CONVERSATION_TYPES.UPDATE_CONVERSATION_SORT,
			payload: {
				...conversation,
				lastMessage: message,
				seen: index ? [false, true] : [true, false],
			},
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
			payload: {
				_id: conversationId,
				messages: res.data.messages,
				cusorTime: res.data.cusorTime || null,
			},
		});
	} catch (err) {
		dispatch({
			type: GLOBALTYPES.ALERT,
			error: err,
		});
	}
};

export const loadMoreMessages =
	(conversationId) => async (dispatch, getState) => {
		try {
			const chat = getState().conversation.chats.find(
				(item) => item._id === conversationId
			);
			if (chat?.cusorTime) {
				const {data} = await getDataApi(
					`message/conversation/${conversationId}?cusorTime=${chat.cusorTime}`
				);

				dispatch({
					type: CONVERSATION_TYPES.UPDATE_CHAT,
					payload: {
						...chat,
						messages: [...chat.messages, ...data.messages],
						cusorTime: data.cusorTime ? data.cusorTime : null,
					},
				});
			}
		} catch (err) {
			console.log(err);
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

export const seenConversation =
	(conversationId, otherId) => async (dispatch, getState) => {
		try {
			const user = getState().auth.user;
			const conversation = getState().conversation.conversations.find(
				(item) => item._id === conversationId
			);
			const index = conversation.members.findIndex(
				(member) => member._id === user._id
			);
			if (conversation.seen[index] === false) {
				await putDataAPI(`conversation/${conversationId}/seen`);
				socket.emit('seen_conversation', conversationId, otherId);
				dispatch({
					type: CONVERSATION_TYPES.UPDATE_CONVERSATION,
					payload: {...conversation, seen: [true, true]},
				});
			}
		} catch (err) {
			dispatch({
				type: GLOBALTYPES.ALERT,
				error: err,
			});
		}
	};

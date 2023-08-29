import {createReducer} from '@reduxjs/toolkit';
import {CONVERSATION_TYPES} from '../actions/conversationAction';
import {addToArray, updateArray} from '../actions/globalTypes';

const initialState = {
	conversations: [],
	chats: [],
	active: null,
};
export const conversationReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(CONVERSATION_TYPES.ACTIVE_CONVERSATION, (state, action) => {
			state.active = action.payload;
		})
		// .addCase(CONVERSATION_TYPES.CREATE_MESSAGE, (state, action) => {
		// 	const chat = state.chats.find(
		// 		(chat) => chat._id === action.payload.conversation
		// 	);
		// 	if (chat) {
		// 		const newChat = {...chat, messages: [action.payload, ...chat.messages]};
		// 		state.chats = updateArray(state.chats, newChat);
		// 	}
		// 	const conversation = state.conversations.find(
		// 		(item) => item._id === action.payload.conversation
		// 	);
		// 	if (conversation) {
		// 		const key = conversation.seen.indexOf
		// 		const newConversation = {
		// 			...conversation,
		// 			text: action.payload.text,
		// 			media: action.payload.media,
		// 		};
		// 		state.conversations = updateArray(state.conversations, newConversation);
		// 	} else {
		// 		const newConversation = {
		// 			_id: action.payload.conversation,
		// 			members: [action.payload.sender, action.payload.receiver],
		// 			text: action.payload.text,
		// 			media: action.payload.media,
		// 		};
		// 	}
		// })
		.addCase(CONVERSATION_TYPES.UPDATE_CHAT, (state, action) => {
			state.chats = updateArray(state.chats, action.payload);
		})
		.addCase(CONVERSATION_TYPES.ADD_CHAT, (state, action) => {
			state.chats = [action.payload, ...state.chats];
		})
		.addCase(CONVERSATION_TYPES.GET_CONVERSATIONS, (state, action) => {
			state.conversations = action.payload;
		})
		.addCase(CONVERSATION_TYPES.UPDATE_CONVERSATION_SORT, (state, action) => {
			let copy = [...state.conversations];
			copy = copy.filter(
				(conversation) => conversation._id !== action.payload._id
			);
			copy = [action.payload, ...copy];
			state.conversations = copy;
		})
		.addCase(CONVERSATION_TYPES.ADD_CONVERSATION, (state, action) => {
			state.conversations = [action.payload, ...state.conversations];
		});
});

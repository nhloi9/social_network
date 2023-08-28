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
		.addCase(CONVERSATION_TYPES.CREATE_MESSAGE, (state, action) => {
			const chat = state.chats.find(
				(chat) => chat._id === action.payload.conversation
			);
			const newChat = {...chat, messages: [action.payload, ...chat.messages]};
			state.chats = updateArray(state.chats, newChat);
		})
		.addCase(CONVERSATION_TYPES.ADD_CHAT, (state, action) => {
			state.chats = [action.payload, ...state.chats];
		})
		.addCase(CONVERSATION_TYPES.GET_CONVERSATIONS, (state, action) => {
			state.conversations = action.payload;
		});
});

import {createReducer} from '@reduxjs/toolkit';
import {SAVE_TYPES} from '../actions/saveAction';
import {removeFromArray} from '../actions/globalTypes';
const initialState = {
	first: true,
	loading: false,
	success: '',
	err: '',
	msg: '',
	posts: [],
};
export const saveReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(SAVE_TYPES.GET_SAVE, (state, action) => {
			state.posts = action.payload;
			state.first = false;
		})
		.addCase(SAVE_TYPES.SAVE, (state, action) => {
			state.posts = [...state.posts, action.payload];
		})
		.addCase(SAVE_TYPES.UNSAVE, (state, action) => {
			state.posts = removeFromArray(state.posts, action.payload);
		});
});

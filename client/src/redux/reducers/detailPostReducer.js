import {createReducer} from '@reduxjs/toolkit';
import {updateArray} from '../actions/globalTypes';
import {POST_TYPES} from '../actions/postAction';
const initialState = [];
export const detailPostReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(POST_TYPES.UPDATE_POST, (state, action) => {
			return updateArray(state, action.payload);
		})
		.addCase(POST_TYPES.GET_POST, (state, action) => {
			return [...state, action.payload];
		});
});

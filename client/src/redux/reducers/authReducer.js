import {createReducer} from '@reduxjs/toolkit';
import {GLOBALTYPES} from '../actions/globalTypes';
const initialState = {};
export const authReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(GLOBALTYPES.AUTH, (state, action) => {
			state.token = action.payload.access_token;
			state.user = action.payload.user;
		})
		.addCase(GLOBALTYPES.TOKEN, (state, action) => {
			state.token = action.payload;
		})
		.addCase(GLOBALTYPES.USER, (state, action) => {
			state.user = action.payload;
		});
});

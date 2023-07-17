import {createReducer} from '@reduxjs/toolkit';
import {GLOBALTYPES} from '../actions/globalTypes';
const initialState = {};
export const authReducer = createReducer(initialState, (bulder) => {
	bulder.addCase(GLOBALTYPES.AUTH, (state, action) => {
		state.token = action.payload.access_token;
		state.user = action.payload.user;
	});
});

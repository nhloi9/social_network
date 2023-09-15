import {createReducer} from '@reduxjs/toolkit';
import {GLOBALTYPES} from '../actions/globalTypes';

const initialState = [];
export const onlineReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(GLOBALTYPES.ONLINE, (state, action) => {
			return [...state, ...action.payload];
		})
		.addCase(GLOBALTYPES.OFFLINE, (state, action) => {
			return state.filter((item) => item !== action.payload) || [];
		});
});

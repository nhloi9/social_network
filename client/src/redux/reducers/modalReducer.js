import {createReducer} from '@reduxjs/toolkit';
import {GLOBALTYPES} from '../actions/globalTypes';
const initialState = false;
export const modalReducer = createReducer(initialState, (builder) => {
	builder.addCase(GLOBALTYPES.MODAL, (state, action) => {
		return action.payload;
	});
});

import {createReducer} from '@reduxjs/toolkit';
import {CALL_TYPES} from '../actions/callAction';

const initialState = null;
export const callReducer = createReducer(initialState, (builder) => {
	builder.addCase(CALL_TYPES.CALL, (state, action) => {
		return action.payload;
	});
});

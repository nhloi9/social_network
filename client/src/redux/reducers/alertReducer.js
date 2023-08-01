import {createReducer} from '@reduxjs/toolkit';
import {GLOBALTYPES} from '../actions/globalTypes';
const initialState = {
	loading: true,
};
export const alertReducer = createReducer(initialState, (bulder) => {
	bulder.addCase(GLOBALTYPES.ALERT, (state, action) => {
		return action.payload;
	});
});

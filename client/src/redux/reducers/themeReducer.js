import {createReducer} from '@reduxjs/toolkit';
import {GLOBALTYPES} from '../actions/globalTypes';
const initialState = localStorage.getItem('theme') === 'dark';
export const themeReducer = createReducer(initialState, (builder) => {
	builder.addCase(GLOBALTYPES.THEME, (state) => {
		return !state;
	});
});

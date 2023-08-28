import {createReducer} from '@reduxjs/toolkit';
import {NOTIFY_TYPES} from '../actions/notifyAction';
import {updateArray} from '../actions/globalTypes';
const initialState = {
	data: [],
	loading: false,
	sound: JSON.parse(localStorage.getItem('sound')) || false,
};
export const notifyReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(NOTIFY_TYPES.GET_ALL, (state, action) => {
			state.data = action.payload;
		})
		.addCase(NOTIFY_TYPES.READ, (state, action) => {
			state.data = updateArray(state.data, action.payload);
		})
		.addCase(NOTIFY_TYPES.ADD, (state, action) => {
			state.data = [action.payload, ...state.data];
		})
		.addCase(NOTIFY_TYPES.DELETEBYSENDER, (state, action) => {
			const deleted = state.data.find((notify) => {
				return (
					notify.sender._id === action.payload.sender &&
					notify.text === action.payload.text &&
					notify.target === action.payload.target
				);
			});
			if (deleted) state.data.splice(state.data.indexOf(deleted), 1);
		})
		.addCase(NOTIFY_TYPES.SOUND, (state, action) => {
			state.sound = action.payload;
		});
});

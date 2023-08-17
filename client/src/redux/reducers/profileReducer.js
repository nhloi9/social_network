import {createReducer} from '@reduxjs/toolkit';
// import {GLOBALTYPES} from '../actions/globalTypes';
import {PROFILE_TYPES} from '../actions/profileAction';
import {updateArray} from '../actions/globalTypes';
const initialState = {
	loading: false,
	success: false,
	users: [],
	err: false,
	loading_follow: false,
	posts: [],
	ids: [],
};
export const profileReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(PROFILE_TYPES.LOADING_FOLLOW, (state, action) => {
			state.loading_follow = action.payload;
		})
		.addCase(PROFILE_TYPES.UPDATE_USER_REQUEST, (state) => {
			state.loading = true;
		})
		.addCase(PROFILE_TYPES.UPDATE_USER_SUCCESS, (state) => {
			state.loading = false;
			state.success = 'edit successfully';
		})
		.addCase(PROFILE_TYPES.UPDATE_USER_FAIL, (state) => {
			state.loading = false;
		})
		.addCase(PROFILE_TYPES.CLEAR_SUCCESS, (state) => {
			state.success = false;
		})
		.addCase(PROFILE_TYPES.GET_USER, (state, action) => {
			state.users = [...state.users, action.payload];
		})
		.addCase(PROFILE_TYPES.FOLLOW, (state, action) => {
			state.users = updateArray(state.users, action.payload);
		})
		.addCase(PROFILE_TYPES.UNFOLLOW, (state, action) => {
			state.users = updateArray(state.users, action.payload);
		})
		.addCase(PROFILE_TYPES.GET_USER_POSTS, (state, action) => {
			state.posts = [...state.posts, action.payload];
		})
		.addCase(PROFILE_TYPES.GET_ID, (state, action) => {
			state.ids = [...state.ids, action.payload];
		});
});

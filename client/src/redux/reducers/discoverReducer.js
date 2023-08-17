import {createReducer} from '@reduxjs/toolkit';
import {DISCOVER_TYPES} from '../actions/discoverAction';
const initialState = {
	first: true,
	page: 1,
	loading: false,
	success: '',
	err: '',
	msg: '',
	posts: [],
	totalPage: 1,
};
export const discoverReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(DISCOVER_TYPES.GET_POSTS_REQUEST, (state) => {
			state.loading = true;
		})
		.addCase(DISCOVER_TYPES.GET_POSTS_SUCCESS, (state, action) => {
			state.loading = false;
			state.posts = [...state.posts, ...action.payload.posts];
			state.page += 1;
			state.first = false;
			state.totalPage = action.payload.totalPage;
			state.success = 'get_posts';
		})
		.addCase(DISCOVER_TYPES.GET_POSTS_FAIL, (state, action) => {
			state.loading = false;
			state.err = action.payload;
		});
});

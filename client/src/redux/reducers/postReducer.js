import {createReducer} from '@reduxjs/toolkit';
// import {GLOBALTYPES} from '../actions/globalTypes';
import {POST_TYPES} from '../actions/postAction';
import {removeFromArray, updateArray} from '../actions/globalTypes';
const initialState = {
	first: true,
	page: 1,
	loading: false,
	success: '',
	err: '',
	msg: '',
	posts: [],
};
export const postReducer = createReducer(initialState, (builder) => {
	builder
		.addCase(POST_TYPES.CREATE, (state, action) => {
			state.posts = [action.payload, ...state.posts];
			state.success = 'create_post';
		})
		.addCase(POST_TYPES.GET_POSTS_REQUEST, (state) => {
			state.loading = true;
		})
		.addCase(POST_TYPES.GET_POSTS_SUCCESS, (state, action) => {
			state.loading = false;
			state.posts = [...state.posts, ...action.payload];
			state.page += 1;
			state.success = 'get_posts';
		})
		.addCase(POST_TYPES.GET_POSTS_FAIL, (state, action) => {
			state.loading = false;
			state.err = action.payload;
		})
		.addCase(POST_TYPES.CLEAR, (state) => {
			state.err = '';
			state.success = '';
		})
		.addCase(POST_TYPES.UPDATE_POST_REQUEST, (state) => {
			state.loading = true;
		})
		.addCase(POST_TYPES.UPDATE_POST_SUCCESS, (state, action) => {
			state.posts = updateArray(state.posts, action.payload);
			state.success = 'update_post';
			state.loading = false;
		})
		.addCase(POST_TYPES.UPDATE_POST_FAIL, (state, action) => {
			state.loading = false;
			state.err = action.payload;
		})
		.addCase(POST_TYPES.LIKE_POST, (state, action) => {
			state.posts = updateArray(state.posts, action.payload);
		})
		// for many action
		.addCase(POST_TYPES.UPDATE_POST, (state, action) => {
			state.posts = updateArray(state.posts, action.payload);
		})
		.addCase(POST_TYPES.DELETE_POST, (state, action) => {
			state.posts = removeFromArray(state.posts, {_id: action.payload});
		});
});

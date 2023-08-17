import {configureStore} from '@reduxjs/toolkit';
import {userReducer} from './reducers/usersReducer';
import {authReducer} from './reducers/authReducer';
import {alertReducer} from './reducers/alertReducer';
import {themeReducer} from './reducers/themeReducer';
import {profileReducer} from './reducers/profileReducer';
import {postReducer} from './reducers/postReducer';
import {modalReducer} from './reducers/modalReducer';
import {detailPostReducer} from './reducers/detailPostReducer';
import {discoverReducer} from './reducers/discoverReducer.js';
import {saveReducer} from './reducers/saveReducer';

export const store = configureStore({
	reducer: {
		user: userReducer,
		auth: authReducer,
		alert: alertReducer,
		theme: themeReducer,
		profile: profileReducer,
		homePost: postReducer,
		modal: modalReducer,
		detailPost: detailPostReducer,
		discover: discoverReducer,
		save: saveReducer,
	},
});

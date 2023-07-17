import {configureStore} from '@reduxjs/toolkit';
import {userReducer} from './reducers/usersReducer';
import {authReducer} from './reducers/authReducer';
import {alertReducer} from './reducers/alertReducer';
import {themeReducer} from './reducers/themeReducer';

export const store = configureStore({
	reducer: {
		user: userReducer,
		auth: authReducer,
		alert: alertReducer,
		theme: themeReducer,
	},
});

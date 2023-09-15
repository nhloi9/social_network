import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from './reducers/authReducer';
import {alertReducer} from './reducers/alertReducer';
import {themeReducer} from './reducers/themeReducer';
import {profileReducer} from './reducers/profileReducer';
import {postReducer} from './reducers/postReducer';
import {modalReducer} from './reducers/modalReducer';
import {detailPostReducer} from './reducers/detailPostReducer';
import {discoverReducer} from './reducers/discoverReducer.js';
import {saveReducer} from './reducers/saveReducer';
import {socketMiddleware} from './middleware/socket';
import {socket} from '../socket';
import {notifyReducer} from './reducers/notifyReducer';
import {conversationReducer} from './reducers/conversation';
import {onlineReducer} from './reducers/onlineFollowing';
import {callReducer} from './reducers/callReducer';

export const store = configureStore({
	reducer: {
		notify: notifyReducer,
		auth: authReducer,
		alert: alertReducer,
		theme: themeReducer,
		profile: profileReducer,
		homePost: postReducer,
		modal: modalReducer,
		detailPost: detailPostReducer,
		discover: discoverReducer,
		save: saveReducer,
		conversation: conversationReducer,
		online: onlineReducer,
		call: callReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(socketMiddleware(socket)),
});

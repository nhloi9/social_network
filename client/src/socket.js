import {io} from 'socket.io-client';
const socket = io('http://localhost:4000', {
	autoConnect: false,
	auth: {
		// token: store.getState().auth.token,
		token: 123,
	},
});
export {socket};

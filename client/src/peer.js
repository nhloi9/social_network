import Peer from 'peerjs';

export const peer = new Peer(undefined, {
	host: 'localhost',
	port: 4000,
	path: '/',
	// secure: true,
});

console.log(peer);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {createServer} = require('http');
const {Server} = require('socket.io');
const path = require('path');
const User = require('./models/user');
// const {PeerServer} = require('peer');
const {ExpressPeerServer} = require('peer');
// const {socketServer} = require('./socketServer');

// PeerServer({
// 	port: 9000,
// 	path: '/myapp',
// 	// proxied: true,
// });

const errorHandler = require('./error/errorHandler');
const notify = require('./models/notify');

const app = express();

// console.log(path.dirname('./apc/kdk.jsx'));
// console.log(__dirname);

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
	res.json('hello world');
});

app.use('/api/v2', require('./routes/authRouter'));
app.use('/api/v2/user', require('./routes/userRouter'));
app.use('/api/v2/post', require('./routes/postRouter'));
app.use('/api/v2/comment', require('./routes/commentRouter'));
app.use('/api/v2/notify', require('./routes/notifyRouter'));
app.use('/api/v2/conversation', require('./routes/conversation'));
app.use('/api/v2/message', require('./routes/message'));

app.use(errorHandler);

const URI = process.env.MONGODB_URL;

const port = process.env.PORT || 4000;

const httpServer = createServer(app);

//peer server
const peerServer = ExpressPeerServer(httpServer, {
	proxied: true,
	debug: true,
	path: '/',
	ssl: {},
});
app.use(peerServer);
// ExpressPeerServer(httpServer, {path: '/'});

//socket.io

const io = new Server(httpServer, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

// socketServer(io);
const users = [];

io.use((socket, next) => {
	const token = socket.handshake.auth.token;
	console.log(token);
	next();
});

io.on('connection', (socket) => {
	console.log('user connection with socket id ' + socket.id);

	//join user
	socket.on('join_user', (userId, followers) => {
		//store followers in session
		// socket.followers = followers
		socket.userId = userId;
		//send online to followers
		const clients = io.sockets.adapter.rooms.get('user_' + userId);
		if (!clients) {
			followers?.forEach((follower) =>
				socket.to('user_' + follower).emit('check_online', [userId])
			);
		}
		socket.join('user_' + userId);
		// users.push({user: userId, socket: socket.id});
	});

	//join post
	socket.on('join_post', (posts) => {
		rooms = posts.map((post) => 'post_' + post);
		socket.join(rooms);
		// console.log(socket.rooms);
	});

	//comment
	socket.on('comment', (comment) => {
		// console.log(comment)
		socket.to('post_' + comment.post).emit('comment', comment);
	});

	//like
	socket.on('like', (like) => {
		socket.to('post_' + like.post).emit('like', like);
	});

	//unlike
	socket.on('unlike', (postId, userId) => {
		socket.to('post_' + postId).emit('unlike', postId, userId);
	});

	//follow
	socket.on('follow', (sender, receiverId) => {
		socket.to('user_' + receiverId).emit('follow', sender);
	});

	//unfollow
	socket.on('unfollow', (senderId, receiverId) => {
		// console.log({sender, receiverId});
		socket.to('user_' + receiverId).emit('unfollow', senderId);
	});

	//notify
	socket.on('notify', (notifies) => {
		try {
			for (const notify of notifies) {
				socket.to('user_' + notify.receiver).emit('notify', notify);
			}
		} catch (error) {}
	});

	//remove notifies by sender
	socket.on('deleteBySender', (msg) => {
		console.log(msg);
		for (item of msg.receiver) {
			socket.to('user_' + item).emit('deleteBySender', {...msg, receiver: item});
		}
	});

	//message
	socket.on('message', (message) => {
		socket.to('user_' + message.receiver._id).emit('message', message);
	});

	//seen message
	socket.on('seen_conversation', (conversationId, otherId) => {
		socket.to('user_' + otherId).emit('seen_conversation', conversationId);
	});

	//check list following online
	socket.on('check_online', (following) => {
		const online = following.filter(
			(user) => io.sockets.adapter.rooms.get('user_' + user)?.size > 0
		);
		socket.emit('check_online', online);
	});

	//call
	socket.on('call', (msg) => {
		socket.to('user_' + msg.receiver).emit('call', msg);
	});

	socket.on('disconnect', async (reason) => {
		console.log('server ger disconnectd', socket.id, 'because', reason);
		if (!io.sockets.adapter.rooms.get('user_' + socket.userId)) {
			console.log(socket.userId);
			const followers = (await User.findById(socket.userId))?.followers;
			followers?.forEach((user) =>
				socket.to('user_' + user).emit('offline', socket.userId)
			);
		}
	});

	// console.log(users);
});

httpServer.listen(port, () => {
	mongoose
		.connect(URI)
		.then((data) =>
			console.log(`mongodb connected with server: ${data.connection.host}`)
		);
	console.log('Server listening on port', port);
});

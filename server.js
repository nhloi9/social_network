require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {createServer} = require('http');
const {Server} = require('socket.io');
const path = require('path');
// const {socketServer} = require('./socketServer');

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

//socket.io
const httpServer = createServer(app);
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
	socket.on('join_user', (userId) => {
		socket.join('user_' + userId);
		const clients = io.sockets.adapter.rooms.get('user_' + userId);
		users.push({user: userId, socket: socket.id});

		console.log(clients);
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

	socket.on('disconnect', (reason) => {
		console.log('server ger disconnectd', socket.id, 'because', reason);
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

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {createServer} = require('http');
const {Server} = require('socket.io');
const path = require('path');

const errorHandler = require('./error/errorHandler');

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

io.on('connection', (socket) => {
	console.log('user connection with socket id ' + socket.id);
});

httpServer.listen(port, () => {
	mongoose
		.connect(URI)
		.then((data) =>
			console.log(`mongodb connected with server: ${data.connection.host}`)
		);
	console.log('Server listening on port', port);
});

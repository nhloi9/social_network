require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./error/errorHandler');

const app = express();

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

app.use(errorHandler);

const URI = process.env.MONGODB_URL;

const port = process.env.PORT || 4000;
app.listen(port, () => {
	mongoose
		.connect(URI)
		.then((data) =>
			console.log(`mongodb connected with server: ${data.connection.host}`)
		);
	console.log('Server listening on port', port);
});

const error = require('../error/error');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const user = require('../models/user');

module.exports = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return next(new error('Please login to access this resource', 401));
		}
		const accessToken = req.headers.authorization.split(' ')[1];
		if (!accessToken) {
			return next(new error('Please login to access this resource', 401));
		}
		const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
		if (!decode) {
			return next(new error('Please login to access this resource', 401));
		}
		const user = await User.findById(decode.id);
		req.user = user;
		return next();
	} catch (err) {
		// console.log(err.message);
		// can check if err.message ==='jwt expired' ,next(new error(err.message, 401));
		next(new error(err.message, 401));
	}
};

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');

const redis = require('../redis/redis');
const User = require('../models/user');
const error = require('../error/error');
const fs = require('fs');

// fs.mkdirSync('/upload');
// fs.mkdirSync(path.join(__dirname, 'upload'));

const authController = {
	register: async (req, res, next) => {
		try {
			const {fullname, username, email, password, gender, cfPassword} = req.body;
			if (cfPassword !== password) {
				return next(new error('confirm password is not match with password'));
			}
			const user_name =
				fullname
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.replace(/ /g, '') +
				'_' +
				Math.random().toString(36).slice(5, 10);
			const user_email = await User.findOne({email});
			if (user_email) {
				return next(new error('this email is already used', 400));
			}
			const user = await User.create({
				fullname,
				username: user_name,
				email,
				password,
				gender,
			});
			// console.log(user);
			const access_token = createAccessToken({id: user._id});
			const refresh_token = createRefreshToken({id: user._id});

			return res
				.cookie('refresh_token', refresh_token, {
					maxAge: 30 * 24 * 60 * 60 * 1000,
					path: '/api/v2/refresh_token',
					httpOnly: true,
				})
				.status(201)
				.json({
					msg: 'Register Success!',
					access_token,
					user: {...user.toObject(), password: ''},
				});
		} catch (err) {
			return next(err);
			// return res.status(500).json({msg: error.message});
		}
	},
	login: async (req, res, next) => {
		console.log(path.resolve('/comment.js'));
		console.log(__dirname);
		try {
			const {email, password} = req.body;
			const user = await User.findOne({email})
				.select('+password')
				.populate({path: 'followers following'});
			if (!user) return next(new error('user not found', 404));
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) return next(new error('incorrect password'));
			// console.log(3);
			const access_token = createAccessToken({id: user._id});
			const refresh_token = createRefreshToken({id: user._id});

			return res
				.cookie('refresh_token', refresh_token, {
					maxAge: 30 * 24 * 60 * 60 * 1000,
					path: '/api/v2/refresh_token',
					httpOnly: true,
				})
				.status(201)
				.json({
					msg: 'Login Success!',
					access_token,
					user: {...user.toObject(), password: ''},
				});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	logout: async (req, res, next) => {
		try {
			// console.log(req.cookies);
			const {refresh_token} = req.cookies;
			await redis.del(refresh_token);
			return res
				.status(200)
				.clearCookie('refresh_token', {path: '/api/v2/refresh_token'})
				.json({
					msg: 'Logout success',
				});
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	generateAccessToken: async (req, res, next) => {
		try {
			const {refresh_token} = req.cookies;
			if (!refresh_token) return next(new error('please login', 400));
			if (!redis.exists(refresh_token))
				return next(new error('please login', 400));
			jwt.verify(
				refresh_token,
				process.env.REFRESH_TOKEN_SECRET,
				async (err, decode) => {
					if (err) {
						// console.log(err);
						return next(new error('please login', 400));
					}
					// console.log(decode);
					const user = await User.findById(decode.id).populate(
						'following followers'
					);
					// console.log(user);
					if (!user) {
						return next(new error('please login', 400));
					}
					const access_token = createAccessToken({id: decode.id});
					return res.status(200).json({
						access_token,
						user,
					});
				}
			);
		} catch (err) {
			return next(new error(err.message, 500));
		}
	},
	refresh_token: async (req, res, next) => {
		try {
		} catch (err) {
			return res.status(500).json({msg: error.message});
		}
	},
};
const createAccessToken = (payload) => {
	const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
		// expiresIn: 60 * 10,
		expiresIn: '10 days',
	});

	return access_token;
};
const createRefreshToken = (payload) => {
	const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '30 days',
	});
	redis.set(refresh_token, payload.id, 'EX', 30 * 24 * 60 * 60);
	return refresh_token;
};
module.exports = authController;

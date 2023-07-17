const {Joi} = require('express-validation');

const validate = require('./validate');

const register = {
	body: Joi.object({
		fullname: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string()
			.regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
			.required(),
		gender: Joi.string(),
		cfPassword: Joi.string().required(),
	}),
};

module.exports = {register: validate(register)};

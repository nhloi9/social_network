const {ValidationError} = require('express-validation');
module.exports = function (err, req, res, next) {
	if (err instanceof ValidationError) {
		return res.status(err.statusCode).json({
			msg: err.details,
		});
	} else
		res.status(err.statusCode || 500).json({
			msg: err.message,
		});
};

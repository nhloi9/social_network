const baseValidate = require('express-validation').validate;

const options = {
	context: true,
	keyByField: true,
};

module.exports = (schema) => baseValidate(schema, options);

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: true,
			trim: true,
			maxLength: 25,
		},
		username: {
			type: String,
			required: true,
			trim: true,
			maxLength: 25,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			select: false,
			minLegth: [6, 'password must be at least 6 characters'],
			required: true,
		},
		avatar: {
			type: String,
			default:
				'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
		},
		role: {
			type: String,
			default: 'user',
		},
		gender: {
			type: String,
			default: 'male',
		},
		mobile: {type: String, default: ''},
		address: {
			type: String,
			default: '',
		},
		story: {
			type: String,
			maxLength: 200,
			default: '',
		},
		website: {
			type: String,
			default: '',
		},
		followers: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'user',
			},
		],
		following: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'user',
			},
		],
		saved: [{type: mongoose.Types.ObjectId, ref: 'user'}],
	},
	{
		timestamps: true,
	}
);
userSchema.pre('save', async function (next) {
	// Only run this function if password was moddified (not on other update functions)
	if (!this.isModified('password')) return next();
	// Hash password with strength of 12
	this.password = await bcrypt.hash(this.password, 12);

	//remove the confirm field
});
userSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('user', userSchema);

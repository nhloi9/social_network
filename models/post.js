const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'user',
		},
		content: String,
		images: {
			type: Array,
			default: [],
			required: [true, 'please provide an image'],
		},
		// likes: [
		// 	{
		// 		type: mongoose.Types.ObjectId,
		// 		ref: 'user',
		// 	},
		// ],
	},
	{
		timestamps: true,
		toJSON: {virtuals: true},
		toObject: {virtuals: true},
	}
);
// userSchema.pre('save', async function (next) {
// 	// Only run this function if password was moddified (not on other update functions)
// 	if (!this.isModified('password')) return next();
// 	// Hash password with strength of 12
// 	this.password = await bcrypt.hash(this.password, 12);

// 	//remove the confirm field
// });
// userSchema.methods.comparePassword = function (password) {
// 	return bcrypt.compareSync(password, this.password);
// };
postSchema.virtual('likes', {
	ref: 'post_like',
	localField: '_id',
	foreignField: 'post',
});
postSchema.virtual('comments', {
	ref: 'comment',
	localField: '_id',
	foreignField: 'post',
});
module.exports = mongoose.model('post', postSchema);

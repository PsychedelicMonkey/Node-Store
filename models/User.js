const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			select: false,
		},
		googleId: {
			type: String,
		},
	},
	{ timestamps: true }
);

// Hash password on save
User.pre('save', async function (next) {
	// Return if password has not changed
	if (!this.isModified('password')) {
		return next();
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(this.password, salt);

	this.password = hash;
	next();
});

// Compare entered password with hash
User.methods.checkPassword = async function (password) {
	const success = await bcrypt.compare(password, this.password);

	return success;
};

module.exports = mongoose.model('User', User);

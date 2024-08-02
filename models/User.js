const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	}
});

// Pre-save hook to hash the password before saving the user
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (err) {
		next(err);
	}
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;

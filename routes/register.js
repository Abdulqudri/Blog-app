const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Render the registration form
router.get('/register', (req, res) => {
	res.render('register');
});

// Handle registration
router.post('/register', async (req, res) => {
	const { username, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).render('register', { message: 'User already exists' });
		}

		const user = new User({ username, email, password });
		await user.save();

		req.session.userId = user._id;
		res.redirect('/');
	} catch (err) {
		res.status(500).render('register', { message: 'Error registering user' });
	}
});

module.exports = router;


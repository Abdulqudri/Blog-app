const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Render the login form
router.get('/login', (req, res) => {
	res.render('login');
});

// Handle login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).render('login', { message: 'Invalid email or password' });
		}

		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(400).render('login', { message: 'Invalid email or password' });
		}

		req.session.userId = user._id;
		res.redirect('/');
	} catch (err) {
		res.status(500).render('login', { message: 'Error logging in' });
	}
});

module.exports = router;

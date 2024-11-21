const User = require('../models/User')

const userController = {
	login: async (req, res) => {
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
		},
	register: async (req, res) => {
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
		}
}

module.exports = userController;
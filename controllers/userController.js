const User = require('../models/User')

const userController = {
	login: async (req, res) => {
			const { email, password } = req.body;

			try {
				const user = await User.findOne({ email });
				if (!user) {
					return res.status(400).render('login', { message: 'Invalid email or password' ,layout: 'layouts/signing'});
				}

				const isMatch = await user.comparePassword(password);
				if (!isMatch) {
					return res.status(400).render('login', { message: 'Invalid email or password', layout: 'layouts/signing' });
				}

				req.session.userId = user._id;
				res.redirect('/');
			} catch (err) {
				res.status(500).render('login', { message: 'Error logging in', layout: 'layouts/signing' });
			}
		},
	register: async (req, res) => {
			const { username, email, password } = req.body;

			try {
				const existingUser = await User.findOne({ email });
				if (existingUser) {
					return res.status(400).render('register', { message: 'User already exists',layout: 'layouts/signing' });
				}

				const user = new User({ username, email, password });
				await user.save();

				req.session.userId = user._id;
				res.redirect('/');
			} catch (err) {
				res.status(500).render('register', { message: 'Error registering user',layout: 'layouts/signing' });
			}
		}
}

module.exports = userController;
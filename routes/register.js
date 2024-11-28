const express = require('express');
const router = express.Router();
const {register} = require('../controllers/userController');


// Render the registration form
router.get('/register', (req, res) => {
	res.render('register' , {layout: 'layouts/signing'});
});

// Handle registration
router.post('/register', register);

module.exports = router;


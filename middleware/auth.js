module.exports = function(req, res, next) {
	if (req.session.userId) {
		return next();
	}
	res.redirect('/viewlogin');
};

const isGuest = (req, res, next) => {
	if (!req.isAuthenticated()) {
		return next();
	}

	return res.redirect('/');
};

const loginRequired = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}

	req.flash('error', 'Please log in to access this page');
	return res.redirect('/auth/login');
};

module.exports = { isGuest, loginRequired };

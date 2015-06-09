var passport = require('passport'),
	mongoose = require('mongoose'),
	User = require(__dirname + '/../models/user'),
	router = require('express').Router();

router.get('/', ensureAuthenticated, 	function (req, res, next) {
	res.render(__dirname + '/../views/index');
});

router.get('/login', function (req, res, next) {
	res.render(__dirname + '/../views/login');
});

router.post('/login', function (req, res, next) {

	passport.authenticate('local', function (err, user, info) {
		if (err) return next(err);
		if (!user) return res.render(__dirname + '/../views/login', { message: info.message });
		req.logIn(user, function (err) {
			if (err) return next(err);
			return res.redirect('/');
		});
	})(req, res, next);	
});

router.get('/logout', function (req, res, next) {
	req.logout();
	res.redirect('/');
});

function ensureAuthenticated (req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}

module.exports = router;
var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

module.exports = function (app, res, req) {

	app.get('/', ensureAuthenticated, function(req, res){
		res.render('index.html');
	});

	// AUTHENTICATION

	app.get('/login', function(req, res){
		res.render('login.html', { user: req.user, message: req.session.messages });
	});

	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				req.session.messages = [info.message];
				return res.redirect('/login');
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }

				req.session.messages = "";

				console.log(moment().format(dateFormat) + ' - Succesvolle login door ' + user.username );
				return res.redirect('/');

			});
		})(req, res, next);
	});

	app.get('/logout', ensureAuthenticated, function(req, res){

		console.log(moment().format(dateFormat) + ' - Succesvolle logout door ' + req.user.username );
		req.logout();

		res.redirect('/');
	});

	// LAYOUT

	app.get('/partials/:partial', function(req, res) {
		res.render("partials/" + req.params.partial + ".html");
	});

	// MONEY
	
	var money = require(__dirname + '/money');
	app.post('/money/:year/:month', ensureAuthenticated, money.moneyList);
	app.post('/money/detail', ensureAuthenticated, money.moneyDetail);

	app.post('/money/new', ensureAuthenticated, money.moneyNew);
	app.post('/money/edit', ensureAuthenticated, money.moneyEdit);
	app.post('/money/delete', ensureAuthenticated, money.moneyDelete);

	// STATS
	var stats = require(__dirname + '/stats');

	// CATEGORY

	var category = require(__dirname + '/category');
	app.get('/category/list', ensureAuthenticated, category.categoryList);
	app.post('/category/new', ensureAuthenticated, category.categoryNew);

	// USERS

	var User = require(__dirname + '/../models/user');
	app.get('/users/list', ensureAuthenticated, function(req, res){

		User.find({})
		.select('username')
		.exec(function (err, users) {
			if (err) console.log(err);
			return res.send(users);
		});
	});

}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}
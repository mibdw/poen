var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

module.exports = function (app, res, req) {

	app.get('/', ensureAuthenticated, function(req, res){
		res.render('index.html');
	});

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
		req.logout();
		res.redirect('/');
	});

	app.get('/sidebar/:partial', function(req, res) {
		res.render(req.params.partial + ".html");
	});

	var money = require(__dirname + '/money');
	app.post('/money/list', ensureAuthenticated, money.list);
	app.post('/money/detail', ensureAuthenticated, money.detail);
	app.post('/money/create', ensureAuthenticated, money.create);
	app.post('/money/edit', ensureAuthenticated, money.edit);
	app.post('/money/remove', ensureAuthenticated, money.remove);

	var category = require(__dirname + '/category');
	app.post('/category/list', ensureAuthenticated, category.list);
	app.post('/category/create', ensureAuthenticated, category.create);
	app.post('/category/edit', ensureAuthenticated, category.edit);
	app.post('/category/remove', ensureAuthenticated, category.remove);
	app.post('/category/expense', ensureAuthenticated, category.expense);
	app.post('/category/income', ensureAuthenticated, category.income);

	var users = require(__dirname + '/users');
	app.post('/users/list', ensureAuthenticated, users.list);
	app.post('/users/expense', ensureAuthenticated, users.expense);
	app.post('/users/income', ensureAuthenticated, users.income);
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}
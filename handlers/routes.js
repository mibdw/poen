var passport = require('passport');
var mongoose = require('mongoose');

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
				return res.redirect('/');
			});
		})(req, res, next);
	});

	app.get('/logout', function(req, res){
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

	// CATEGORY

	var Category = require(__dirname + '/../models/category');

	var bill = new Category({ 'name': 'Rekening', 'slug': 'bill' });
	var food = new Category({ 'name': 'Voedsel', 'slug': 'food' });
	var entertainment = new Category({ 'name': 'Vermaak', 'slug': 'entertainment' });
	var homeimprovement = new Category({ 'name': 'Klussen', 'slug': 'homeimprovement' });
	var household = new Category({ 'name': 'Huishouden', 'slug': 'household' });

	bill.save();
	food.save();
	entertainment.save();
	homeimprovement.save();
	household.save();

}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}
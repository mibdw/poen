var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('cookie-session'),
	exphbs = require('express-handlebars'),
	mongoose = require('mongoose'),
	moment = require('moment'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	User = require(__dirname + '/models/user');

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ username: username }, function(err, user) {
		if (err) { return done(err); }
		if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
		user.comparePassword(password, function(err, isMatch) {
			if (err) return done(err);
			if(isMatch) {
				return done(null, user);
			} else {
				return done(null, false, { message: 'Invalid password' });
			}
		});
	});
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ keys: [ 'Nobody fucks with the Jesus', 'Eight years old dude', 'Obviously you\'re not a golfer']}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));


mongoose.connect('mongodb://localhost/poen', function (err) {
	if (err) console.log('Could not connect to mongodb on localhost');
});

app.use('/', require(__dirname + '/handlers/auth'));
app.use('/events', require(__dirname + '/handlers/events'));
app.use('/categories', require(__dirname + '/handlers/categories'));
app.use('/users', require(__dirname + '/handlers/users'));

http.listen(8181, function () {
	console.log('Server started at http://localhost:8181');
});
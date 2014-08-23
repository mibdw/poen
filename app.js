var express = require('express');
var less = require('less-middleware');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var moment = require('moment');

var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";
var User = require(__dirname + '/models/user');
  
mongoose.connect('mongodb://dagobert:g3ldm03tr0llen@localhost:23383/poen');
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', function callback() {
	console.log(moment().format(dateFormat) + ' - De database werkt. Wat een geluk');
});

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

var app = express();

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');

app.use(less(__dirname + '/', {
	dest: __dirname + '/public'
}));


app.use(express.json());

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'Dagobert Duck' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(app.router);
app.use(express.static(__dirname + '/public')); 

var routes = require(__dirname + '/handlers/routes')(app);

app.listen(11074, function() {
	console.log('\n\nPOEN POEN POEN\n\n' + moment().format(dateFormat) + ' - Geld moet rollen');
});

/* SEED A USER 
var user = new User({ username: 'admin', email: 'admin@example.com', password: 'secret' });
user.save(function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log(moment().format(dateFormat) + ' - New user seeded: ' + user.username + ".");
	}
}); */
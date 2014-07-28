// REQUIREMENTS
var express = require('express');
var less = require('less-middleware');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');

var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost/poen');
mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));
mongoose.connection.once('open', function callback() {
	console.log(moment().format(dateFormat) + ' - De database doet het, wat een geluk');
});

var app = express();

// MAIN CONFIGURATION

app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');
app.use(less(__dirname + '/', {
	force: true,
	dest: __dirname + '/public'
}));
app.use(express.static(__dirname + '/public')); 

// ROUTES
var routes = require(__dirname + '/handlers/routes')(app);

// LAUNCH

app.listen(3000, function() {
	console.log('\n\nPOEN\n\n\n'+ moment().format(dateFormat) + ' - Geld moet rollen (http://localhost:3000)');
});
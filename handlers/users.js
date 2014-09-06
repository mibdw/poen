var mongoose = require('mongoose');
var moment = require('moment');
var User = require(__dirname + '/../models/user.js');
var Money = require(__dirname + '/../models/money.js');

exports.list = function(req, res, next) {
	User.find()
	.select('_id username email')
	.exec(function (err, userList) {
		if (err) console.log(err);

		
		return res.send(userList);
	});
};
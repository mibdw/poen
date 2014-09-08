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

exports.expense = function(req, res, next) {
	Money.aggregate(
		{ $match: {
			date: { $gt: new Date(req.body.start), $lt: new Date(req.body.end) }, 
			visible: true, 
			balance: 'expense', 
			user: req.body.id 
		}}, 
		{ $group: { _id: '$user', total: { $sum: '$amount' }}}, 
		function (err, expense) {
		if (err) console.log(err);
		return res.send(expense);
	});
};

exports.income = function(req, res, next) {
	Money.aggregate(
		{ $match: {
			date: { $gt: new Date(req.body.start), $lt: new Date(req.body.end) }, 
			visible: true, 
			balance: 'income', 
			user: req.body.id 
		}}, 
		{ $group: { _id: '$user', total: { $sum: '$amount' }}}, 
		function (err, income) {
		if (err) console.log(err);
		return res.send(income);
	});
};
var mongoose = require('mongoose');
var moment = require('moment');
var Money = require(__dirname + '/../models/money.js');

exports.moneyList = function(req, res, next) {

	var displayMonth = req.body.year + "-" + req.body.month;
	var prevMonth = moment(displayMonth, "YYYY-MM").subtract('months', 3);
	var nextMonth = moment(displayMonth, "YYYY-MM").add('months', 2);

	Money.find({})
	.where('date').gt(prevMonth).lt(nextMonth)
	.populate('user ', 'username')
	.exec(function (err, moneyList) {
		if (err) console.log(err);

		return res.send(moneyList);
	});
};

exports.moneyDetail = function(req, res, next) {

	console.log(req.body);
	Money.findById(req.body.moneyID).populate('user', 'username').exec(function (err, money) {
		if (err) return console.log(err);
	
		console.log(money);
		res.send(money);
	});

};

exports.moneyNew = function(req, res, next) {

	var money = new Money({
		'title': req.body.title,
		'amount': req.body.amount,
		'note': req.body.note,
		'user': req.user._id,
		'date': req.body.date,
		'category': req.body.category,
		'recursion': req.body.recursion,
		'balance': req.body.balance
	}); 

	money.save(function (err) {
		if (err) return console.log(err);
 		res.send('success');
	});
};

exports.moneyEdit = function(req, res, next) {

};

exports.moneyDelete = function(req, res, next) {

};


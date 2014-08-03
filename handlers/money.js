var mongoose = require('mongoose');
var moment = require('moment');
var Money = require(__dirname + '/../models/money.js');

exports.moneyList = function(req, res, next) {

};

exports.moneyDetail = function(req, res, next) {

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
		if (err) return handleError(err);
 		res.send('success');
	});
};

exports.moneyEdit = function(req, res, next) {

};

exports.moneyDelete = function(req, res, next) {

};


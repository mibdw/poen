var mongoose = require('mongoose');
var moment = require('moment');
var Money = require(__dirname + '/../models/money.js');

exports.list = function(req, res, next) {
	if (req.body.users && req.body.users.length > 0 && req.body.categories && req.body.categories.length > 0) {
		Money.find()
		.where('visible').equals(true)
		.where('date').gte(req.body.start).lte(req.body.end)
		.where('user').in(req.body.users)
		.where('category').in(req.body.categories)
		.populate('user', 'username')
		.populate('category')
		.exec(function (err, moneyList) {
			if (err) return console.log(err);
			return res.send(moneyList);
		});
	} else if (req.body.users && req.body.users.length > 0) {
		Money.find()
		.where('visible').equals(true)
		.where('date').gte(req.body.start).lte(req.body.end)
		.where('user').in(req.body.users)
		.populate('user', 'username')
		.populate('category')
		.exec(function (err, moneyList) {
			if (err) return console.log(err);
			return res.send(moneyList);
		});
	} else if (req.body.categories && req.body.categories.length > 0) {
		Money.find()
		.where('visible').equals(true)
		.where('date').gte(req.body.start).lte(req.body.end)
		.where('category').in(req.body.categories)
		.populate('user', 'username')
		.populate('category')
		.exec(function (err, moneyList) {
			if (err) return console.log(err);
			return res.send(moneyList);
		});
	} else {
		Money.find()
		.where('visible').equals(true)
		.where('date').gte(req.body.start).lte(req.body.end)
		.populate('user', 'username')
		.populate('category')
		.exec(function (err, moneyList) {
			if (err) return console.log(err);
			return res.send(moneyList);
		});
	}
};

exports.detail = function(req, res, next) {
	Money.findById(req.body.moneyID)
	.populate('user', '_id username')
	.exec(function (err, money) {
		if (err) return console.log(err);
		return res.send(money);
	});
};

exports.create = function(req, res, next) {
	req.body.user = req.user._id;
	var money = new Money(req.body); 
	money.save(function (err, money) {
		if (err) return console.log(err);
		return res.send(money);
	});
};

exports.edit = function(req, res, next) {
	req.body.user = req.body.user._id;
	Money.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err) {
		if (err) return console.log(err);
		return res.send('success');
	});
};

exports.remove = function(req, res, next) {
	Money.findByIdAndUpdate(req.body._id, { $set: { 'visible': false }}, function (err) {
		if (err) return console.log(err);
		return res.send('success');
	});
};
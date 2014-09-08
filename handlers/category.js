var mongoose = require('mongoose');
var moment = require('moment');
var Category = require(__dirname + '/../models/category.js');
var Money = require(__dirname + '/../models/money.js');

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

exports.list = function(req, res, next) {
	Category.find()
	.exec(function (err, categoryList) {
		if (err) console.log(err);
		return res.send(categoryList);
	});
};

exports.create = function(req, res, next) {
	req.body.slug = slugify(req.body.name);
	var category = new Category(req.body);
	category.save(function (err) {
		if (err) console.log(err);
		return res.send('success'); 		
	});
};

exports.edit = function(req, res, next) { 
	req.body.slug = slugify(req.body.name);
	Category.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err) {
		if (err) console.log(err);
		return res.send('success');
	});
};

exports.remove = function(req, res, next) {
	Money.update({'category': req.body._id}, {'category': req.body.move}, function (err) {
		if (err) console.log(err);
	});	
	Category.findByIdAndRemove(req.body._id, function (err) {
		if (err) return console.log(err);
		return res.send('success');
	});
};

exports.expense = function(req, res, next) {
	if (req.body.users && req.body.users.length > 0) {
		Money.aggregate(
			{ $match: {
				date: { $gte: new Date(req.body.start), $lt: new Date(req.body.end) }, 
				visible: true, 
				balance: 'expense', 
				category: req.body.id, 
				user: { $in: req.body.users }
			}}, 
			{ $group: { _id: '$user', total: { $sum: '$amount' }}}, 
			function (err, expense) {
			if (err) console.log(err);
			return res.send(expense);
		});
	} else {
		Money.aggregate(
			{ $match: {
				date: { $gte: new Date(req.body.start), $lt: new Date(req.body.end) }, 
				visible: true, 
				balance: 'expense', 
				category: req.body.id 
			}}, 
			{ $group: { _id: '$category', total: { $sum: '$amount' }}}, 
			function (err, expense) {
			if (err) console.log(err);
			return res.send(expense);
		});
	}
};

exports.income = function(req, res, next) {
	if (req.body.users && req.body.users.length > 0) {
		Money.aggregate(
			{ $match: {
				date: { $gte: new Date(req.body.start), $lt: new Date(req.body.end) }, 
				visible: true, 
				balance: 'income', 
				category: req.body.id, 
				user: { $in: req.body.users }
			}}, 
			{ $group: { _id: '$user', total: { $sum: '$amount' }}}, 
			function (err, income) {
			if (err) console.log(err);
			return res.send(income);
		});
	} else {
		Money.aggregate(
			{ $match: {
				date: { $gte: new Date(req.body.start), $lt: new Date(req.body.end) }, 
				visible: true, 
				balance: 'income', 
				category: req.body.id 
			}}, 
			{ $group: { _id: '$category', total: { $sum: '$amount' }}}, 
			function (err, income) {
			if (err) console.log(err);
			return res.send(income);
		});
	}
};
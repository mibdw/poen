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
		return res.send('success');
	});	
	Category.findByIdAndRemove(req.body._id, function (err) {
		if (err) return console.log(err);
		res.send('success');
	});
};
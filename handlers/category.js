var mongoose = require('mongoose');
var moment = require('moment');
var Category = require(__dirname + '/../models/category.js');
var Money = require(__dirname + '/../models/money.js');

var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

exports.list = function(req, res, next) {

	Category.find({})
	.exec(function (err, categoryList) {
		if (err) console.log(err);

		return res.send(categoryList);
	});
};

exports.create = function(req, res, next) {

	var slug = slugify(req.body.name);
	var category = new Category({
		'name': req.body.name,
		'color': req.body.color,
		'slug': slug
	}); 

	category.save(function (err) {
		if (err) {
			res.send('error');
		} else {
			res.send('success');
		}
 		
	});
};

exports.edit = function(req, res, next) { 

	var slug = slugify(req.body.name);

	Category.findByIdAndUpdate(req.body._id, { $set: { 
	
		'name': req.body.name,
		'color': req.body.color,
		'slug': slug

	}}, function (err) {

		if (err) {

			Category.findById(req.body._id).exec(function (err, category) {
				if (err) {
					
					res.send('error');
				} else {

					res.send(category);
				}
			
			});

		} else {
			res.send('success');			
		}

	});
};

exports.remove = function(req, res, next) {

	Money.find({})
	.where('category').equals(req.body._id)
	.exec(function (err, moneyList) {

		if (err) {

			console.log(err);

		} else {

			for (i in moneyList) {

				Money.findByIdAndUpdate(moneyList[i]._id, { $set: { 'category': req.body.move }}, function (err) {

					if (err) return console.log(err);
					console.log(moment().format(dateFormat) + ' - Edited Money object: \'' + moneyList[i].title + '\' by ' + req.user.username );
				});
			}
		}
	});

	Category.findByIdAndRemove(req.body._id, function (err) {
		if (err) return console.log(err);
		res.send('success');
	});
};
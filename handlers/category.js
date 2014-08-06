var mongoose = require('mongoose');
var Category = require(__dirname + '/../models/category.js');

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

exports.categoryList = function(req, res, next) {

	Category.find({})
	.exec(function (err, categoryList) {
		if (err) console.log(err);

		return res.send(categoryList);
	});
};

exports.categoryNew = function(req, res, next) {

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
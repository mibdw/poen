var router = require('express').Router(),
	mongoose = require('mongoose'),
	Money = require(__dirname + '/../models/money'),
	Category = require(__dirname + '/../models/category');

function slugify(text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

router.get('/fetch', function (req, res, next) {
	Category.find()
	.exec(function (err, results) {
		if (err) console.log(err);
		return res.send(results);
	});
});

router.post('/create', function (req, res, next) {
	req.body.slug = slugify(req.body.name);
	var category = new Category(req.body);
	category.save(function (err) {
		if (err) console.log(err);
		return res.send('success'); 		
	});
});

router.post('/edit', function (req, res, next) { 
	req.body.slug = slugify(req.body.name);
	Category.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err) {
		if (err) console.log(err);
		return res.send('success');
	});
});

router.post('/remove', function (req, res, next) {
	Money.update({'category': req.body._id}, {'category': req.body.move}, function (err) {
		if (err) console.log(err);
		
		Category.findByIdAndRemove(req.body._id, function (err) {
			if (err) return console.log(err);
			return res.send('success');
		});
	});	
});

module.exports = router;
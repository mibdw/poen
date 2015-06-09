var router = require('express').Router(),
	mongoose = require('mongoose'),
	Money = require(__dirname + '/../models/money');

router.get('/fetch', function (req, res) {
	Money.find()
	.where('visible').equals(true)
	.where('date').gte(req.query.start).lte(req.query.end)
	.populate('user', 'username')
	.populate('category')
	.exec(function (err, results) {
		if (err) return console.log(err);
		return res.send(results);
	});
});

router.post('/create', function (req, res, next) {
	req.body.user = req.user._id;
	var money = new Money(req.body); 
	money.save(function (err, money) {
		if (err) return console.log(err);
		Money.findById(money._id)
		.populate('user', 'username')
		.populate('category')
		.exec(function (err, result) {
			if (err) return console.log(err);
			return res.send(result);
		});
	});
});

router.post('/edit', function (req, res, next) {
	Money.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err, money) {
		if (err) return console.log(err);
		Money.findById(money._id)
		.populate('user', 'username')
		.populate('category')
		.exec(function (err, result) {
			if (err) return console.log(err);
			return res.send(result);
		});
	});
});

router.post('/remove', function(req, res, next) {
	Money.findByIdAndUpdate(req.body._id, { $set: { 'visible': false }}, function (err) {
		if (err) return console.log(err);
		return res.send(req.body);
	});
});

module.exports = router;
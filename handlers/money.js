var mongoose = require('mongoose');
var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

var Money = require(__dirname + '/../models/money.js');

exports.moneyList = function(req, res, next) {

	var displayMonth = req.body.year + "-" + req.body.month;
	var prevMonth = moment(displayMonth, "YYYY-MM").subtract('months', 3);
	var nextMonth = moment(displayMonth, "YYYY-MM").add('months', 2);

	Money.find({})
	.where('date').gt(prevMonth).lt(nextMonth)
	.populate('user', 'username')
	.populate('category', 'name slug color')
	.exec(function (err, moneyResults) {
		if (err) console.log(err);

		Money.find({})
		.where('date').gt(prevMonth)
		.where('recursion').equals('monthly')
		.populate('user', 'username')
		.populate('category', 'name slug color')
		.exec(function (err, moneyRecursions) {
			
			moneyResults.concat(moneyRecursions);
			return res.send(moneyResults);
		});
	});
};

exports.moneyDetail = function(req, res, next) {

	Money.findById(req.body.moneyID).populate('user', 'username').exec(function (err, money) {
		if (err) return console.log(err);
	
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

		console.log(moment().format(dateFormat) + ' - Nieuw Money object: \'' + req.body.title + '\' door ' + req.user.username );

		if (req.body.recursion == "monthly" && moment().isAfter(req.body.date)) {

			var now = moment();
			for (i = moment(req.body.date); moment(i).isBefore(now); i = moment(i).add(1, 'M')) {
				console.log(i.format("YYYY-MM"));

				var moneyRepeat = new Money({
					'title': req.body.title,
					'amount': req.body.amount,
					'note': req.body.note,
					'user': req.user._id,
					'date': req.body.date,
					'category': req.body.category,
					'recursion': req.body.recursion,
					'balance': req.body.balance
					
				}); 
			}

			res.send('success');
		
		} else {

			res.send('success');
		}

		
	});


};

exports.moneyEdit = function(req, res, next) {

	Money.findByIdAndUpdate(req.body._id, { $set: { 
	
		'title': req.body.title,
		'amount': req.body.amount,
		'note': req.body.note,
		'date': req.body.date,
		'category': req.body.category,
		'recursion': req.body.recursion,
		'balance': req.body.balance 

	}}, function (err) {
		if (err) return console.log(err);

		console.log(moment().format(dateFormat) + ' - Bewerkt Money object: \'' + req.body.title + '\' door ' + req.user.username );
		res.send('success');
	});

};

exports.moneyDelete = function(req, res, next) {

	Money.findByIdAndRemove(req.body._id, function (err) {
		if (err) return console.log(err);

		console.log(moment().format(dateFormat) + ' - Verwijdert Money object: \'' + req.body.title + '\' door ' + req.user.username );
		res.send('success');
	});
};


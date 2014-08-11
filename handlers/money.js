var mongoose = require('mongoose');
var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

var Money = require(__dirname + '/../models/money.js');

exports.moneyList = function(req, res, next) {

	var displayMonth = req.body.year + "-" + req.body.month;
	var prevMonth = moment(displayMonth, "YYYY-MM").subtract('months', 1).date('20');
	var nextMonth = moment(displayMonth, "YYYY-MM").add('months', 1).date('15');;

	Money.find({})
	.where('date').gt(prevMonth).lt(nextMonth)
	.populate('user', 'username')
	.populate('category', 'name slug color')
	.exec(function (err, moneyResults) {
		if (err) console.log(err);

		Money.find({})
		.where('date').lt(nextMonth)
		.where('recursion').equals('monthly')
		.exec(function (err, moneyRecursions) {
	
			if (err) {

				return console.log(err);

			} else if (moneyRecursions.length > 0) {

				var numRecursions = 0;
				for (x in moneyRecursions) {

					var hitList = 0;
					var now = moment().add(1, 'M').startOf('month');

					for (y in moneyResults) {

						if (moneyResults[y].originID == moneyRecursions[x]._id && 
							moment(moneyResults[y].date).format("MM") == req.body.month) {
							hitList = hitList + 1;
						}
					}

					if (moment(displayMonth, 'YYYY-MM').date(2).isBefore(now) &&
						moment(displayMonth, 'YYYY-MM').endOf('month').isAfter(moneyRecursions[x].date) &&
						moment(moneyRecursions[x].date).format('MM') != req.body.month &&
						moneyRecursions[x].visible != false && 
						hitList == 0) {
						
						var newDate = req.body.year + "-" + req.body.month + "-" + moment(moneyRecursions[x].date).format('DD');

						var moneySave = new Money({
							'title': moneyRecursions[x].title,
							'amount': moneyRecursions[x].amount,
							'note': moneyRecursions[x].note,
							'user': moneyRecursions[x].user,
							'date': newDate,
							'category': moneyRecursions[x].category,
							'recursion': 'once',
							'balance': moneyRecursions[x].balance,
							'originID': moneyRecursions[x]._id,
							'visible': true
						});

						moneySave.save(function (err, moneySave) {
							if (err) return console.log(err);
						});
					}

					numRecursions = numRecursions + 1;
					if (numRecursions == moneyRecursions.length) {

						setTimeout(function () {
							Money.find({})
							.where('visible').equals(true)
							.where('date').gt(prevMonth).lt(nextMonth)
							.populate('user', 'username')
							.populate('category', 'name slug color')
							.exec(function (err, moneyStuff) {
								if (err) console.log(err);
								return res.send(moneyStuff);
							});
						}, 1);
					}
				}

			} else {

				Money.find({})
				.where('visible').equals(true)
				.where('date').gt(prevMonth).lt(nextMonth)
				.populate('user', 'username')
				.populate('category', 'name slug color')
				.exec(function (err, moneyStuff) {
					if (err) console.log(err);
					return res.send(moneyStuff);
				});
			}
		});
	});
};

exports.moneyDetail = function(req, res, next) {

	Money.findById(req.body.moneyID).populate('user', 'username').exec(function (err, money) {
		if (err) {
			
			res.send('error');
		} else {

			res.send(money);
		}
	
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
		'balance': req.body.balance,
		'originID': false,
		'visible': true
	}); 

	money.save(function (err, money) {
		if (err) return console.log(err);

		console.log(moment().format(dateFormat) + ' - New Money object created: \'' + req.body.title + '\' by ' + req.user.username );

		if (req.body.recursion == "monthly" && moment().isAfter(req.body.date)) {

			var now = moment().add(1, 'M').startOf('month');
			
			for (i = moment(req.body.date).add(1, 'M'); moment(i).isBefore(now); i = moment(i).add(1, 'M')) {

				var moneyRepeat = new Money({
					'title': req.body.title,
					'amount': req.body.amount,
					'note': req.body.note,
					'user': req.user._id,
					'date': i.format('YYYY-MM-DD'),
					'category': req.body.category,
					'recursion': 'once',
					'balance': req.body.balance,
					'originID': money._id,
					'visible': true
				}); 

				moneyRepeat.save(function (err, moneyRepeat) {
					if (err) return console.log(err);
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

		console.log(moment().format(dateFormat) + ' - Edited Money object: \'' + req.body.title + '\' by ' + req.user.username );
		res.send('success');
	});

};

exports.moneyDelete = function(req, res, next) {

	Money.findByIdAndUpdate(req.body._id, { $set: { 'visible': false }}, function (err) {
		if (err) return console.log(err);

		console.log(moment().format(dateFormat) + ' - Deleted Money object: \'' + req.body.title + '\' by ' + req.user.username );
		res.send('success');
	});
};
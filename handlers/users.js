var router = require('express').Router(),
	mongoose = require('mongoose'),
	Money = require(__dirname + '/../models/money');

router.get('/current', function (req, res) {
	return res.send({
		_id: req.user._id,
		username: req.user.username,
		email: req.user.email
	});
});

module.exports = router;
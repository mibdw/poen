var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moneySchema = new Schema({
	title: { type: String, require: true },
	amount: Number,
	note: String,
	user: { type: String, ref: 'User' },
	date: Date,
	category: { type: String, ref: 'Category' },
	recursion: String,
	balance: String
});

var User = require(__dirname + '/user');
var Category = require(__dirname + '/category');

module.exports = mongoose.model('Money', moneySchema);
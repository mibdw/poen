var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var moneySchema = new Schema({
	title: { type: String, require: true },
	amount: Number,
	note: String,
	user: { type: String, ref: 'User' },
	date: Date,
	category: { type: String, ref: 'Category' },
	balance: String,
	visible: { type: Boolean, default: true }
});

var User = require(__dirname + '/user');
var Category = require(__dirname + '/category');

module.exports = mongoose.model('Money', moneySchema);
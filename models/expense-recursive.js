var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseRecursiveSchema = new Schema({
	title: { type: String, require: true },
	amount: Number,
	note: String,
	user: { type: String, ref: 'User' },
	startDate: Date,
	endDate: Date,
	category: { type: String, ref: 'Category' },
	recursion: String,
	ownage: { type: String, ref: 'User' },
});

var User = require(__dirname + '/user');
var Category = require(__dirname + '/category');

module.exports = mongoose.model('ExpenseRecursive', expenseRecursiveSchema);
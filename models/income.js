var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
	title: { type: String, require: true, unique: true },
	slug: String,
	body: String,
	author: { type: String, ref: 'User' },
	dateCreated: Date,
	editor: { type: String, ref: 'User' },
	dateModified: Date,
	parent: String
});

var User = require(__dirname + '/user');

module.exports = mongoose.model('Doc', docSchema);
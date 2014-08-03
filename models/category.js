var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categorySchema = new Schema({
	name: { type: String, unique: true },
	slug: String
});

module.exports = mongoose.model('Category', categorySchema);


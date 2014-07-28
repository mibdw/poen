module.exports = function (app, res, req) {

	app.get('/', function(req, res) {
		res.render('index.html');
	});
}
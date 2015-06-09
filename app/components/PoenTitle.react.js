var React = require('react'),
	moment = require('moment');

require('moment/locale/nl');

module.exports = React.createClass({
	render: function () {
		var title = this.props.viewMonth.format('MMMM YYYY');
		var capitalized = title.charAt(0).toUpperCase() + title.slice(1);
		document.title = "Poen - " + capitalized;
		return (
			<div className="poen-title-wrapper">
				<h2 className="poen-title">
					<img src="dagobert.gif" /> {capitalized}
				</h2>
				<span className="poen-loading">
					<img src="spinner.gif" />
				</span>
			</div>
		)
	}
});
var React = require('react'),
	moment = require('moment'),
	PoenTableUsers = require('./PoenTableUsers.react'),
	PoenTableCats = require('./PoenTableCats.react');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	handleUser: function (payload) {
		this.props.changeFilterUser(payload);
	},
	handleCat: function (payload) {
		this.props.changeFilterCat(payload);
	},
	handleClear: function (payload) {
		this.props.changeFilterCat('clear');
	},
	render: function () {
		return (
			<div className="poen-overview">
				<h3>Balans</h3>

				<PoenTableUsers 
					events={this.props.events} 
					date={this.props.date} 
					filterUser={this.props.filterUser} 
					changeUser={this.handleUser} />

				<PoenTableCats 
					sidebarChange={this.props.sidebarChange}
					events={this.props.filteredCat} 
					cats={this.props.filterCats} 
					date={this.props.date} 
					changeCat={this.handleCat} 
					clearCats={this.handleClear}
					editCategory={this.props.editCategory} />
			</div>
		);
	}
});
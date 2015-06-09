var React = require('react'),
	moment = require('moment');

module.exports = React.createClass({
	timeTravel: function (event) { 
		event.preventDefault();
		this.props.gotoMonth(event.target.dataset.timetravel); 
	},
	sidebarChange: function (event) {
		event.preventDefault();
		this.props.sidebarChange(event.target.dataset.sidebar);
		this.props.createEvent('__new');
	},
	render: function () {
		var toggleLink;
		if (this.props.currentSidebar == 'none') {
			toggleLink = <a href="" onClick={this.sidebarChange} data-sidebar="overview">Balans</a>   
		} else {
			toggleLink = <a href="" onClick={this.sidebarChange} data-sidebar="none">Kalender</a>
		}

		return (
			<ul className={'poen-nav ' + this.props.currentSidebar}>
				<li className={moment().isSame(this.props.viewMonth, 'month') ? 'today hide' : 'today'}>
					<a href="" onClick={this.timeTravel} data-timetravel="today">Vandaag</a>
				</li>
				<li className='prev'>
					<a href="" onClick={this.timeTravel} data-timetravel="prev">&laquo; Vorige</a>
				</li>
				<li className="next">
					<a href="" onClick={this.timeTravel} data-timetravel="next">Volgende &raquo;</a>
				</li>
				<li className="toggle">
					{toggleLink}
				</li>
				<li>
					<a href="" onClick={this.sidebarChange} className={this.props.currentSidebar == 'create' ? 'active' : ''} data-sidebar="create">Toevoegen</a>
				</li>
				<li>
					<a href="/logout">Logout</a>
				</li>
			</ul>
		)
	}
});
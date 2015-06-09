var React = require('react'),
	$ = require('jquery'),
	moment = require('moment'),
	fullCalendar = require('fullcalendar');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	sidebarChange: function (arg) {
		this.props.sidebarChange(arg);
	},
	detailEvent: function (event) {
		event.others = this.props.events.filter(function (ev) {
			return moment(ev.date).isSame(event.date, 'month') && ev.category._id == event.category._id;
		})
		this.props.detailEvent(event);
	},
	createEvent: function (date) {
		this.props.createEvent(date);
	},
	componentDidMount: function () {	
		var self = this;	
		$('.poen-calendar').fullCalendar({
			header: false,
			firstDay: 1,
			dayClick: function (date, jsEvent, view) {
				self.sidebarChange('create');
				self.createEvent(date);
			},
			events: function (start, end, timezone, callback) {
				self.props.monthChange(start, end, function () {
					callback(self.props.filtered);
				});
			},
			loading: function (isLoading, view) {
				if (isLoading == true) $('.poen-loading').addClass('active');
				if (isLoading == false) $('.poen-loading').removeClass('active');
			},
			eventRender: function (event, element) {
				element.css('background-color', event.category.color);
				element.attr('key', event._id);
				element.attr('title', event.title + " = " + round(event.amount));
				element.append('<span class="fc-user" style="color: ' + event.category.color + '">' + event.user.username.charAt(0) + '</span>');
				if (moment(event.date).isSame(self.props.viewMonth, 'month')) element.addClass('insider');
			},
			eventClick: function (event, jsEvent, view) {
				if (moment(event.date).isSame(self.props.viewMonth, 'month')) {
					self.sidebarChange('detail');
					self.detailEvent(event);
				}
			}
		});
	},
	componentWillReceiveProps: function (nextProps) {
		$('.poen-calendar').fullCalendar('gotoDate', nextProps.viewMonth);
	},
	shouldComponentUpdate: function () {
		return false;
	},
	render: function () {
		return (
			<div className='poen-calendar'></div>
		);
	}
});
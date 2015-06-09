var React = require('react'),
	$ = require('jquery'),
	moment = require('moment'),
	fullCalendar = require('fullcalendar'),
	PoenTitle = require('./PoenTitle.react'),
	PoenNav = require('./PoenNav.react'),
	PoenCalendar = require('./PoenCalendar.react'),
	PoenCreate = require('./PoenCreate.react'),
	PoenEdit = require('./PoenEdit.react'),
	PoenDetail = require('./PoenDetail.react'),
	PoenCategory = require('./PoenCategory.react'),
	PoenOverview = require('./PoenOverview.react');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	getInitialState: function () {
		return {
			month: moment(),
			sidebar: 'none',
			detail: {
				category: {},
				user: {},
				others: []
			},
			create: {},
			events: [],
			filteredCat: [],
			filteredAll: [],
			user: '__all',
			categories: [],
			catList: [],
			currentUser: {},
			editCat: ''
		}		
	},
	componentDidMount: function () {
		this.fetchUser();
		this.fetchCategories();
	}, 
	fetchUser: function () {
		var self = this;
		$.ajax({
			url: '/users/current',
			dataType: 'json',
			success: function (user) {
				self.setState({ currentUser: user });
			}
		});
	},
	fetchEvents: function (start, end, callback) {
		var self = this;
		$.ajax({ 
			url: '/events/fetch', 
			data: { start: start.format(), end: end.format() },
			dataType: 'json',
			success: function (results) {	
				self.setState({ events: results, filteredCat: results, filteredAll: results }, function () { 
					self.filterEvents(function () {	
						$('.poen-calendar').fullCalendar('removeEvents');
						callback();
					});
				});
 			} 
		});
	},
	fetchCategories: function () {
		var self = this;
		$.ajax({
			url: '/categories/fetch',
			dataType: 'json',
			success: function (categories) {	
				self.setState({ catList: categories });
 			}
		});
	},
	handleSidebar: function (arg, event) {
		this.setState({ sidebar: arg });
	},
	handleNav: function (arg) {
		var month = this.state.month;
		if (arg == 'today') this.setState({ month: moment() });
		if (arg == 'next') this.setState({ month: month.add(1, 'months') });
		if (arg == 'prev') this.setState({ month: month.subtract(1, 'months') });
	},
	handleEdit: function (event) {
		this.setState({detail: event});
	},
	handleCreate: function (date) {
		this.setState({create: date});
	},
	createEvent: function (ev) {
		var self = this;
		var newEvents = self.state.events;
		newEvents.push(ev);
		this.setState({events: newEvents}, function () {
			self.filterEvents(function () {});
		});
	},
	handleFilterUser: function (user) {
		var self = this;
		self.setState({ user: user }, function () { 
			self.filterEvents(function () {
				$('.poen-calendar').fullCalendar('removeEvents');	
				$('.poen-calendar').fullCalendar('addEventSource', self.state.filteredAll);	
			});
		});
	},
	handleFilterCat: function (cat) {
		var self = this;		
		var cats = self.state.categories;
		var index = cats.indexOf(cat);

		if (index > -1) cats.splice(index, 1);
		if (index == -1) cats.push(cat);

		if (cat == 'clear') cats = [];

		self.setState({ categories: cats }, function () {
			self.filterEvents(function () {
				$('.poen-calendar').fullCalendar('removeEvents');	
				$('.poen-calendar').fullCalendar('addEventSource', self.state.filteredAll);	
			})
		});	
	},
	handleEditCategory: function (id) {
		this.setState({ editCat: id });
	},
	filterEvents: function (callback) {
		var self = this;
		var initEvents = self.state.events;
		var userEvents = self.state.events;
		var categoryEvents = self.state.events;

		if (self.state.user != '__all') {
			userEvents = initEvents.filter(function (ev) {
				return self.state.user == ev.user._id;
			});
			categoryEvents = userEvents;
		}

		if (self.state.categories.length > 0) {
			categoryEvents = userEvents.filter(function (ev) {
				return self.state.categories.indexOf(ev.category._id) > -1;
			});
		}

		self.setState({ events: initEvents, filteredCat: userEvents, filteredAll: categoryEvents }, function () { callback(); });
	},
	render: function () {
		var poenSidebar;
		if (this.state.sidebar == 'create') {
			poenSidebar = (
				<PoenCreate 
					sidebarChange={this.handleSidebar} 
					createDate={this.state.create}
					catList={this.state.catList}
					createEvent={this.createEvent} />
			);
		} else if (this.state.events.length < 1) {
			poenSidebar = (
				<em>No items for this month</em>
			);
		} else if (this.state.sidebar == 'edit') {
			poenSidebar = (
				<PoenEdit 
					sidebarChange={this.handleSidebar} 
					editEvent={this.state.detail}
					catList={this.state.catList} />
			);
		} else if (this.state.sidebar == 'detail') {
			poenSidebar = (
				<PoenDetail 
					sidebarChange={this.handleSidebar} 
					detailEvent={this.state.detail}
					gotoDetail={this.handleEdit}
					currentUser={this.state.currentUser} />
			);
		} else if (this.state.sidebar == 'category') {
			poenSidebar = (
				<PoenCategory
					sidebarChange={this.handleSidebar} 
					category={this.state.editCat}
					catList={this.state.catList}
					fetchCats={this.fetchCategories} />
			);
		} else if (this.state.sidebar == 'overview' || this.state.sidebar == 'none') {
			poenSidebar = (
				<PoenOverview 
					sidebarChange={this.handleSidebar} 
					date={this.state.month} 
					events={this.state.events} 
					filteredCat={this.state.filteredCat} 
					filteredAll={this.state.filteredAll} 
					filterUser={this.state.user} 
					filterCats={this.state.categories} 
					changeFilterUser={this.handleFilterUser} 
					changeFilterCat={this.handleFilterCat}
					editCategory={this.handleEditCategory} />
			);
		} 

		return (
			<div className="poen-wrapper">
				<header className="poen-header">
					
					<PoenTitle 
						viewMonth={this.state.month} />
									
					<PoenNav 
						viewMonth={this.state.month} 
						gotoMonth={this.handleNav} 
						currentSidebar={this.state.sidebar} 
						sidebarChange={this.handleSidebar} 
						createEvent={this.handleCreate} />

				</header>
				<main className={'poen-body ' + this.state.sidebar}>
					
					<PoenCalendar 
						viewMonth={this.state.month} 
						events={this.state.events}
						currentSidebar={this.state.sidebar} 
						filtered={this.state.filteredAll}
						monthChange={this.fetchEvents}
						sidebarChange={this.handleSidebar}
						detailEvent={this.handleEdit}
						createEvent={this.handleCreate} />
					
					<div className='poen-sidebar'>
						{poenSidebar}					
					</div>
				</main>
			</div>
		)
	}
});
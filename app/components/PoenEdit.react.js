var React = require('react'),
	moment = require('moment'),
	$ = require('jquery');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	getInitialState: function () {
		return {
			_id: '',
			title: '',
			amount: '',
			balance: 'expense',
			date: {},
			note: '',
			category: '',
			user: '',
			visible: true,
			valid: true,
		}
	},
	componentDidMount: function () {
		var self = this;
		this.setState({
			_id: self.props.editEvent._id,
			title: self.props.editEvent.title,
			amount: round(Math.abs(self.props.editEvent.amount)),
			balance: self.props.editEvent.balance,
			date: self.props.editEvent.date,
			note: self.props.editEvent.note,
			category: self.props.editEvent.category._id,
			user: self.props.editEvent.user._id,
			visible: self.props.editEvent.visible
		}, function () {
			this.activeDay();
		});
	},
	closeSidebar: function (e) {
		e.preventDefault();
		$('.fc-day').removeClass('active');
		this.props.sidebarChange('none');
	},
	editEvent: function (e) {
		var self;
		e.preventDefault();
		self = this;

		var amount = this.state.amount;
		if (this.state.balance == 'expense') amount = -Math.abs(amount);

		var payload = {
			_id: self.state._id,
			title: self.state.title,
			amount: amount,
			balance: self.state.balance,
			date: moment(self.state.date).format(),
			note: self.state.note,
			category: self.state.category || self.props.catList[0]._id			
		};
		
		$.ajax({
			type: 'POST',
			url: '/events/edit', 
			data: payload,
			success: function (data) {
				$('.poen-calendar').fullCalendar('refetchEvents');
				self.props.sidebarChange('overview');
			}
		});
	},
	activeDay: function () {
		if (this.state.date) {
			var date = moment(this.state.date).format("YYYY-MM-DD");
			$('.fc-day').removeClass('active');
			$('.fc-day[data-date=' + date + ']').addClass('active');
		}
	},
	handleDelete: function (e) {
		if (confirm('Weet je het zeker?')) {

			var self;
			e.preventDefault();
			self = this;

			$.ajax({
				type: 'POST',
				url: '/events/remove', 
				data: { _id: self.state._id },
				success: function (data) {
					$('.poen-calendar').fullCalendar('refetchEvents');
					$('.fc-day').removeClass('active');
					self.props.sidebarChange('overview');
				}
			});
		}
	},
	handleAmount: function (e) {
		var amount = Number(e.target.value);
		if (isNaN(amount)) {
			this.setState({ valid: false });
		} else {
			this.setState({ valid: true, amount: round(e.target.value) });
		}
	},
	handleChange: function (e) {
		var self = this;
		var currentDate = this.state.date;
		if (e.target.name == 'title') this.setState({ title: e.target.value });
		if (e.target.name == 'amount') this.setState({ amount: e.target.value });
		if (e.target.name == 'balance') this.setState({ balance: e.target.value });
		
		if (e.target.name == 'day') {
			this.setState({ date: moment(currentDate).date(e.target.value) }, function () {
				self.activeDay();
			});
		} 
		if (e.target.name == 'month') {
			this.setState({ date: moment(currentDate).month(Number(e.target.value)) }, function () {
				self.activeDay();
			});
		} 
		if (e.target.name == 'year') {
			this.setState({ date: moment(currentDate).year(e.target.value) }, function () {
				self.activeDay();
			});
		} 

		if (e.target.name == 'note') this.setState({ note: e.target.value });
		if (e.target.name == 'category') this.setState({ category: e.target.value });
	},
	render: function () {
		var startYear = moment(this.props.editEvent.date).subtract(5, 'years').format('YYYY');
		var yearList = [];
		for (var i = 0; i < 10; i++) {
			var year = Number(startYear) + i;
			yearList.push(<option value={year} key={'year-' + year}>{year}</option>);
		}

		var monthList = [];
		for (var i = 0; i < 12; i++) {
			var month = i;
			monthList.push(<option value={month} key={'month-' + month}>{moment().month(i).format('MMMM')}</option>);
		}

		var dayList = [];
		var daysNumber = Number(moment(this.props.editEvent.date).daysInMonth()) + 1;
		for (var i = 1; i < daysNumber; i++) {
			dayList.push(<option value={i} key={'day-' + i}>{i}</option>);
		}

		var catList = [];
		for (i in this.props.catList) {
			catList.push(<option value={this.props.catList[i]._id} key={'cat-' + this.props.catList[i]._id}>{this.props.catList[i].name}</option>)
		}

		return (
			<div className="poen-edit">
				<h3>
					Bewerken
					<a href="" onClick={this.closeSidebar}>Sluit</a>
				</h3>

				<form onSubmit={this.editEvent} className="poen-form">
					<input type="text" name="title" placeholder="Titel"	required="required" value={this.state.title} onChange={this.handleChange} />
					
					<div className="poen-price">
						<input type="text" name="amount" placeholder="Bedrag" className="poen-amount" value={this.state.amount} onChange={this.handleChange} required="required" onBlur={this.handleAmount} />
						<select name="balance" className="poen-balance" onChange={this.handleChange} value={this.state.balance} required="required">
							<option value='expense'>Uitgave</option>
							<option value='income'>Inkomst</option>
						</select>
					</div>

					<div className="poen-date">
						<select name="day"  value={moment(this.state.date).format('D')} onChange={this.handleChange} className="poen-day" required="required">
							{dayList}
						</select>
						<select name="month" value={moment(this.state.date).month()} onChange={this.handleChange} className="poen-month" required="required">
							{monthList}
						</select>
						<select name="year" value={moment(this.state.date).format('YYYY')} onChange={this.handleChange} className="poen-year" required="required">
							{yearList}
						</select>
					</div>

					<textarea name="note" placeholder="Notitie" value={this.state.note} onChange={this.handleChange} maxLength='300'></textarea>

					<select name="category" value={this.state.category} onChange={this.handleChange}>
						{catList}
					</select>

					<a href='' onClick={this.handleDelete} className="poen-link">Verwijderen</a>
					<button type="submit" disabled={!this.state.valid}>Bewerken</button>
				</form>

			</div>
		);
	}
});
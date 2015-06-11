var React = require('react'),
	moment = require('moment'),
	$ = require('jquery');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
};

module.exports = React.createClass({
	getInitialState: function () {
		return {
			title: '',
			amount: '',
			balance: 'expense',
			date: {},
			note: '',
			category: '',
			valid: false,
			numberValid: true,
		}
	},
	componentDidMount: function () {
		var self = this, 
			date = this.props.createDate,
			now = new Date();

		if (this.props.createDate == '__new') date = moment(now);

		this.setState({ date: date }, function () {
			self.activeDay();
		});
	},
	componentWillReceiveProps: function (nextProps) {
		var self = this,
			date = nextProps.createDate,
			now = new Date();

		if (nextProps.createDate == '__new') date = moment(now);
		
		this.setState({ date: date }, function () {
			self.activeDay();
		});
	},
	activeDay: function () {
		if (this.state.date) {
			var date = moment(this.state.date).format("YYYY-MM-DD");
			$('.fc-day').removeClass('active');
			$('.fc-day[data-date=' + date + ']').addClass('active');
		}
	},
	closeSidebar: function (e) {
		e.preventDefault();
		$('.fc-day').removeClass('active');
		this.props.sidebarChange('none');
	},
	createEvent: function (e) {
		var self;
		e.preventDefault();
		self = this;

		var amount = this.state.amount;
		if (this.state.balance == 'expense') amount = -Math.abs(amount);

		var payload = {
			title: self.state.title,
			amount: amount,
			balance: self.state.balance,
			date: moment(self.state.date).format(),
			note: self.state.note,
			category: self.state.category || self.props.catList[0]._id			
		};
		
		$.ajax({
			type: 'POST',
			url: '/events/create', 
			data: payload,
			success: function (data) {
				self.props.sidebarChange('none');
				$('.poen-calendar').fullCalendar('renderEvent', data);
				$('.fc-day').removeClass('active');
				self.props.createEvent(data);
			}
		});
	},
	handleAmount: function (e) {
		var amount = Number(e.target.value);
		if (isNaN(amount) || e.target.value == '') {
			this.setState({ valid: false, numberValid: false });
		} else {
			this.setState({ 
				valid: true, 
				numberValid: true, 
				amount: round(Math.abs(e.target.value)),
			});
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
		var startYear = moment(this.state.date).subtract(5, 'years').format('YYYY');
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
		var daysNumber = Number(moment(this.state.date).daysInMonth()) + 1;
		for (var i = 1; i < daysNumber; i++) {
			dayList.push(<option value={i} key={'day-' + i}>{i}</option>);
		}

		var catList = [];
		for (i in this.props.catList) {
			catList.push(<option value={this.props.catList[i]._id} key={'cat-' + this.props.catList[i]._id}>{this.props.catList[i].name}</option>)
		}

		return (
			<div className="poen-create">
				<h3>
					Toevoegen
					<a href="" onClick={this.closeSidebar}>Sluit</a>
				</h3>

				<form onSubmit={this.createEvent} className="poen-form">
					<input type="text" name="title" placeholder="Titel"	required="required" onChange={this.handleChange} />
					
					<div className="poen-price">
						<input type="text" name="amount" placeholder="Bedrag" value={this.state.amount} className={this.state.numberValid ? "poen-amount" : "poen-amount invalid"} onChange={this.handleChange} onBlur={this.handleAmount} required="required" />
						<select name="balance" value={this.state.balance} className="poen-balance" onChange={this.handleChange} required="required">
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

					<textarea name="note" placeholder="Notitie" onChange={this.handleChange} maxLength='300'></textarea>

					<select name="category" required="required" onChange={this.handleChange} value={this.state.category}>
						{catList}
					</select>

					<button type="submit" disabled={!this.state.valid}>Toevoegen</button>
				</form>
			</div>
		);
	}
});
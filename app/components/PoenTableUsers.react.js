var React = require('react'),
	moment = require('moment');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	handleUser: function (e) {
		this.props.changeUser(e.target.value);
	},
	render: function () {
		var self = this;
		var users = [
			{
				username: 'totaal',
				_id: '__all',
				sum: 0
			}
		];

		var userEvents = self.props.events.filter(function (ev) {
			return moment(self.props.date).isSame(ev.date, 'month');
		});

		userEvents.forEach(function (ev) {
			var ui = -1;
			for (i in users) { if (ev.user._id == users[i]._id) ui = i; }

			if (ui == -1) {
				var newUser = {
					username: ev.user.username,
					_id: ev.user._id,
					sum: 0
				};
				users.push(newUser);
				ui = users.indexOf(newUser);
			}

			users[0].sum = users[0].sum + ev.amount; 
			users[ui].sum = users[ui].sum + ev.amount; 
		});

		users.sort(function (a, b) {
			return a.username > b.username;
		});

		var userList = users.map(function (user) {
			return (
				<tr key={user._id} className={self.props.filterUser == user._id ? 'active' : ''}>
						<td className='radio'>
							<input type='radio' name='userList' value={user._id} id={user._id} checked={self.props.filterUser == user._id ? true : false} onChange={self.handleUser} />
						</td>
						<td className='username'>
							<label htmlFor={user._id}>{user.username}</label>
						</td>
						<td className={user.sum < 0 ? 'sum negative' : 'sum positive'}>
							<label htmlFor={user._id}>{round(user.sum)}</label>
						</td>
				</tr>
			);
		}.bind(this));

		return (
			<table className="poen-table">
				<tbody>
					{userList}
				</tbody>
			</table>
		);
	},
});
var React = require('react'),
	moment = require('moment'),
	$ = require('jquery'),
	d3 = require('d3');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	handleGoto: function (other) {
		other.others = this.props.ev.others;
		this.props.gotoDetail(other);
	},
	componentWillReceiveProps: function (nextProps) {
		var self = this;
		$('.poen-chart').html('');
		var width = $('.poen-chart').width(),
			height = 213,
			barPad = 1,
			dataset = nextProps.ev.others;

		dataset.sort(function (a, b) {
			return a.date > b.date;
		});

		var extreme = 0;
		dataset.forEach(function (data) {
			if (Math.abs(data.amount) > extreme) extreme = Math.abs(data.amount);
		});

		var svg = d3.select('.poen-chart')
			.append('svg') 
			.attr('width', width)
			.attr('height', height);

		var rect = svg.selectAll('rect')
			.data(dataset)
			.enter()
			.append('rect')
			.attr('x', function(d, i) {
				return i * (width / dataset.length);
			})
			.attr('y', function (d) {
				if (d.amount < 0) {
					return 100 - ((Math.abs(d.amount) / extreme) * 100);
				} else {
					return 108;
				}
			})
			.attr('width', (width / dataset.length) - barPad)
			.attr('height', function (d) {
				var h = (Math.abs(d.amount) / extreme) * 100;
				return h + 5;
			})
			.attr('fill', function (d, i) {
				return d.category.color;
			})
			.attr('class', function (d, i) {
				if (d._id == nextProps.ev._id) return 'active';
			});

		var line = svg.append('line')
			.attr('x1', 0)
			.attr('y1', height / 2)
			.attr('x2', width)
			.attr('y2', height / 2)
			.attr('stroke-width', 1)
			.attr('stroke', '#bbb');

		rect.on('click', function (d) {
			self.handleGoto(d);
		})
	},
	render: function () {
		var self = this;
		var others = this.props.ev.others;
		others.sort(function (a, b) {
			return a.date > b.date;
		});

		var yay;
		others.forEach(function (other, index) {
			if (other._id == self.props.ev._id) yay = index;
		});

		var otherList = others.map(function (other, index) {
			if (index == yay || index > (yay - 5) && index < (yay + 5)) {
				var gotoDetail = self.handleGoto.bind(self, other);
				return (
					<tr className={other._id == self.props.ev._id ? 'clickable active' : 'clickable'} key={'other-' + other._id} onClick={gotoDetail}>
						<td className='icon'>
							<i style={{backgroundColor: other.category.color}}></i>
						</td>
						<td className='user'>
							<span className='user-badge'>{other.user.username.charAt(0)}</span>
						</td>
						<td className='date'>{moment(other.date).format('dd DD-MM')}</td>
						<td className='other'>{other.title}</td>
						<td className={other.amount < 0 ? 'sum negative' : 'sum positive'}>{round(other.amount)}</td>
					</tr>
				);
			}
		});

		var otherPrev, otherNext;
		if (yay > 4) {
			otherPrev = (
				<div className="more top">&hellip; {yay - 4} hiervoor</div>
			);
		}
		
		if (others.length > (yay + 5)) {
			otherNext = (
				<div className="more">&hellip; {others.length - (yay + 5)} hierna</div>
			);
		}

		return (
			<div>
				<h3>{this.props.ev.category.name} <small>{others.length} posten</small></h3>
				
				{otherPrev}
				<table className="poen-table">
					<tbody>
						{otherList}
					</tbody>
				</table>
				{otherNext}

				<div className="poen-chart">
				</div>
			</div>
		);
	}
});
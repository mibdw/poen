var React = require('react'),
	d3 = require('d3'),
	$ = require('jquery');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	getInitialState: function () {
		return {
			title: this.props.title,
			total: 0,
			initTotal: 0
		}
	},
	componentDidMount: function () {
		var self = this;
		this.bakeDonut(self.props);
	},
	componentWillReceiveProps: function (nextProps) {
		this.bakeDonut(nextProps);		
	},
	shouldComponentUpdate: function () {
		return true;
	},
	bakeDonut: function (dough) {
		$('#' + dough.title).html('');
		var dataset = dough.cats,
			width = $('.poen-donut-' + dough.title).innerWidth(),
			height = $('.poen-donut-' + dough.title).innerWidth(),
			donutWidth = 40,
			radius = Math.min(width, height) / 2;

		var svg = d3.select('#' + dough.title)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', 'translate(' + (width / 2) +  ',' + (height / 2) + ')');	

		var arc = d3.svg.arc()
			 .innerRadius(radius - donutWidth)
			.outerRadius(radius);

		var pie = d3.layout.pie()
			.value(function (d) { return d.sum; })
			.sort(function (a, b) {
				return d3.descending(a.name, b.name);
			});

		var path = svg.selectAll('path')
			.data(pie(dataset))
			.enter()
			.append('path')
			.attr('d', arc)
			.attr('stroke-width', 1)
			.attr('stroke', 'white')
			.style('fill', function (d) { return d.data.color });

		var amount = 0
		dataset.forEach(function (d) {
			amount = amount + d.sum;
		});
		this.setState({total: amount, initTotal: amount});

		var self = this;
		path.on('mouseover', function (d) {
			self.setState({ title: d.data.name, total: d.data.sum });
		});

		path.on('mouseout', function (d) {
			self.setState({ title: self.props.title, total: self.state.initTotal });
		});

		path.on('click', function (d) {
			$('input[type="checkbox"]#' + d.data._id).click()
		});
	},
	render: function () {		
		return (
			<div className={'poen-donut poen-donut-' + this.props.title}>
				<div className='poen-donut-info'>
					<div className='poen-donut-info-title'>{this.state.title}</div>
					<div className={this.state.total < 0 ? 'negative' : 'positive'}>{round(this.state.total)}</div>
				</div>
				<div id={this.props.title}></div>
			</div>
		)
	}
});

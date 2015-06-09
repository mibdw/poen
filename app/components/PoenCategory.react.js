var React = require('react'),
	$ = require('jquery');

module.exports = React.createClass({
	getInitialState: function () {
		return {
			_id: '',
			name: '',
			color: '',
			remove: false,
			move: ''
		};
	},
	componentDidMount: function () {
		var catList = this.props.catList,
			self = this;

		if (this.props.category != '__new') {
			for (i in catList) {
				if (catList[i]._id == this.props.category) {
					self.setState({
						_id: catList[i]._id,
						name: catList[i].name,
						color: catList[i].color
					});
				}
			}
		}
	},
	closeSidebar: function (e) {
		e.preventDefault();
		this.props.sidebarChange('none');
	},
	handleChange: function (e) {
		e.preventDefault();
		if (e.target.name == 'name') this.setState({ name: e.target.value });		
		if (e.target.name == 'color') this.setState({ color: e.target.value });	
		if (e.target.name == 'color-text') this.setState({ color: e.target.value });		
		
	},
	handleSubmit: function (e) {
		var self;
		e.preventDefault();
		self = this;

		var payload = {
			name: self.state.name,
			color: self.state.color,
		};

		if (this.props.category == '__new') {
			$.ajax({
				type: 'POST',
				url: '/categories/create', 
				data: payload,
				success: function (data) {
					$('.poen-calendar').fullCalendar('refetchEvents');
					self.props.fetchCats();
					self.props.sidebarChange('overview');
				}
			});
		} else if (this.state.remove == true) {
			if (!self.state.move) return alert('Please select replacement category');
			payload._id = self.state._id;
			payload.move = self.state.move;
			$.ajax({
				type: 'POST',
				url: '/categories/remove', 
				data: payload,
				success: function (data) {
					$('.poen-calendar').fullCalendar('refetchEvents');
					self.props.fetchCats();
					self.props.sidebarChange('overview');
				}
			});
		} else {
			payload._id = self.state._id;
			$.ajax({
				type: 'POST',
				url: '/categories/edit', 
				data: payload,
				success: function (data) {
					$('.poen-calendar').fullCalendar('refetchEvents');
					self.props.fetchCats();
					self.props.sidebarChange('overview');
				}
			});

		}
	},
	toggleRemove: function (e) {
		e.preventDefault();
		var toggle = this.state.remove ? this.setState({ remove: false }) : this.setState({ remove: true });
	},
	handleRemove: function (e) {
		this.setState({ move: e.target.value });
	},
	render: function () {
		var removeLink;
		if (this.props.category != '__new') removeLink = <a href='' className={this.state.remove ? 'poen-link hide' : 'poen-link'} onClick={this.toggleRemove}>Verwijderen</a>

		var catList = [];
		for (i in this.props.catList) {
			catList.push(<option value={this.props.catList[i]._id} key={'cat-' + this.props.catList[i]._id}>{this.props.catList[i].name}</option>)
		}

		var buttonText;
		if (this.state.remove == true) {
			buttonText = 'Verwijderen';
		} else {
			buttonText = 'Bewaren';
		}

		return (
			<div>
				<h3>
					Categorie
					<a href="" onClick={this.closeSidebar}>Sluit</a>
				</h3>

				<form onSubmit={this.handleSubmit} className='poen-form'>
					<input type='text' name='name' value={this.state.name} onChange={this.handleChange} placeholder='Categorie naam' />

					<div className="poen-color">
						<input type='color' name='color' value={this.state.color} onChange={this.handleChange} />
						<input type='text' name='color-text' value={this.state.color} onChange={this.handleChange} placeholder='Kleur' />
					</div>

					<div className={this.state.remove ? '' : 'hide'}>
						<label htmlFor='remove'>
							Verplaats bestaande posten binnen categorie naar:					
						</label>
						<select id='remove' value={this.state.move} onChange={this.handleRemove}>
							{catList}
						</select>
					</div>

					{removeLink}
					<button type="submit">{buttonText}</button>

				</form>
			</div>

		);
	}
});
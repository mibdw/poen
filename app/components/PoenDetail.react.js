var React = require('react'),
	moment = require('moment'),
	PoenDetailOthers = require('./PoenDetailOthers.react');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	propTypes: {
		detailEvent: React.PropTypes.object,
	},
	closeSidebar: function (e) {
		e.preventDefault();
		this.props.sidebarChange('none');
	},
	editEvent: function (e) {
		e.preventDefault();
		this.props.sidebarChange('edit');
	},
	render: function () {
		var self = this;
		var date = moment(this.props.detailEvent.date).format('DD-MM-YYYY');
		var fromNow = moment(this.props.detailEvent.date).fromNow();

		var editLink;
		if (this.props.detailEvent.user._id == this.props.currentUser._id) {
			editLink = <a href="" onClick={this.editEvent}>Bewerken</a>;
		} else {
			editLink = '';
		}

		return (
			<div className="poen-detail">
				<h3>
					Detail
					<a href="" onClick={this.closeSidebar}>Sluit</a>
				</h3>

				<dl className="poen-deflist">
					<dt>Titel:</dt>
					<dd>{this.props.detailEvent.title}</dd>
					<dt>Bedrag:</dt>
					<dd className={this.props.detailEvent.amount < 0 ? 'poen-amount negative' : 'poen-amount positive'}>{round(this.props.detailEvent.amount)}</dd>
					<dt>Datum:</dt>
					<dd>{date} <small>{fromNow}</small></dd>
					<dt>Categorie:</dt>
					<dd>
						<i style={{backgroundColor: this.props.detailEvent.category.color}}></i> {this.props.detailEvent.category.name}
					</dd>
					<dt>Gebruiker:</dt>
					<dd className="poen-user">{this.props.detailEvent.user.username}</dd>
					<dt className={this.props.detailEvent.note ? '' : 'hide'}>Notitie:</dt>
					<dd className={this.props.detailEvent.note ? '' : 'hide'}><em>{this.props.detailEvent.note}</em></dd>
				</dl>

				<div className="poen-options">
					&nbsp; {editLink}
				</div>

				<PoenDetailOthers ev={this.props.detailEvent} gotoDetail={this.props.gotoDetail} />
			</div>
		);
	}
});

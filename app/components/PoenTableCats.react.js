var React = require('react'),
	moment = require('moment'),
	PoenDonut = require('./PoenDonut.react');

function round (value) {
	return Number(Math.round(value+'e2')+'e-2').toFixed(2);
}

module.exports = React.createClass({
	changeCat: function (e) {
		this.props.changeCat(e.target.value);
	},
	clearCats: function (e) {
		e.preventDefault();
		this.props.clearCats();
	},
	editCategory: function (e) {
		e.preventDefault();
		this.props.sidebarChange('category');
		this.props.editCategory(e.target.dataset.category)
	},
	render: function () {
		var self = this;
		var categoryEvents = self.props.events.filter(function (ev) {
			return moment(self.props.date).isSame(ev.date, 'month');
		});

		var cats = {
			all: [],
			inc: [],
			exp: [],
		};

		categoryEvents.forEach(function (ev) {
			var ci = -1;
			for (i in cats.all) { if (ev.category._id == cats.all[i]._id) ci = i }

			if (ci == -1) {
				var newCat = {
					name: ev.category.name,
					_id: ev.category._id,
					color: ev.category.color,
					sum: 0
				};
				cats.all.push(newCat);
				ci = cats.all.indexOf(newCat);
			}
			cats.all[ci].sum = cats.all[ci].sum + ev.amount;

			if (ev.amount < 0) {
				var cio = -1;
				for (j in cats.exp) { if (ev.category._id == cats.exp[j]._id) cio = j }

				if (cio == -1) {
					var newCatOut = {
						name: ev.category.name,
						_id: ev.category._id,
						color: ev.category.color,
						sum: 0
					};
					cats.exp.push(newCatOut);
					cio = cats.exp.indexOf(newCatOut);
				}
				cats.exp[cio].sum = cats.exp[cio].sum + ev.amount;
			}

			if (ev.amount > 0) {
				var cii = -1;
				for (k in cats.inc) { if (ev.category._id == cats.inc[k]._id) cio = k }

				if (cii == -1) {
					var newCatIn = {
						name: ev.category.name,
						_id: ev.category._id,
						color: ev.category.color,
						sum: 0
					};
					cats.inc.push(newCatIn);
					cii = cats.inc.indexOf(newCatIn);
				}
				cats.inc[cii].sum = cats.inc[cii].sum + ev.amount;
			}
		});

		cats.all.sort(function (a, b) {
			return a.name > b.name;
		});

		var catList = cats.all.map(function (cat) {
			return (
				<tr key={cat._id} className={self.props.cats.indexOf(cat._id) > -1 ? 'active' : ''}>
						<td className='checkbox'>
							<label htmlFor={cat._id}>
								<input type='checkbox' checked={self.props.cats.indexOf(cat._id) > -1} onChange={self.changeCat} value={cat._id} id={cat._id} />
							</label>
						</td>
						<td className='category'>
							<label htmlFor={cat._id}>
								<i style={{backgroundColor: cat.color}}></i> {cat.name}
								<a className="small" onClick={self.editCategory} data-category={cat._id}>Bewerk</a>
							</label>
						</td>
						<td className={cat.sum < 0 ? 'sum negative' : 'sum positive'}>
							<label htmlFor={cat._id}>{round(cat.sum)}</label>
						</td>
				</tr>
			);
		});

		return (
			<span>
				<table className="poen-table">
					<tbody>
						{catList}
					</tbody>
				</table>
				<a href='' className={self.props.cats.length == 0 ? 'poen-table-clear hide' : 'poen-table-clear'} onClick={self.clearCats}>Filter wissen</a>
				<a href='' className='poen-table-newcat' onClick={self.editCategory} data-category='__new'>Nieuwe categorie</a>

				<div className='poen-donuts'>
					<PoenDonut title='uitgaven' cats={cats.exp} />
					<PoenDonut title='inkomsten' cats={cats.inc} />
				</div>
			</span>
		);
	},
})
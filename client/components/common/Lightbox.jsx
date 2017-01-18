import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import * as util from '../../lib/util';

export default class Lightbox extends Component {
	constructor(props) {
		super(props);

		this.onClick = (e) => {
			e.preventDefault();
			e.stopPropagation();

			this.props.parent.closeLightbox();
		};

		this.onPreviewClick = (e) => {
			console.log('[Lightbox.onPreviewClick]');
			e.preventDefault();
			e.stopPropagation();
			if (Meteor.isCordova)
				return;
			window.open(this.props.photo, '', '_blank');
		};
	}

	componentDidMount() {
	}

	render() {
		let clses = ['lightbox'];
		if (this.props.classes)
			clses.push(this.props.classes);
		if (this.props.isOpen)
			clses.push('open');
		let style = {
			backgroundImage: `url(${this.props.photo})`,
		};
		return (
			<div onClick={this.onPreviewClick} className={clses.join(' ')}>
				<div className="close fontH1" onClick={this.onClick}><img src="/img/close.svg" /></div>
				<div className="button defaultButton active" onClick={this.onClick}>Закрыть</div>
				<div className="block" ref="block">
					<div className="photo" ref="photo" style={style} />
				</div>
			</div>
		);
	}
}

Lightbox.contextTypes = {
	router: React.PropTypes.object,
};

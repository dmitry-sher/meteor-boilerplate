import React, { Component } from 'react';
import * as util from '../../lib/util';
const scrlt = require('jquery.scrollto');

export default class Link extends Component {
	constructor(props) {
		super(props);

		this.state = {
			clicked: false,
		};

		this.onClick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (this.state.clicked)
				return;

			// setTimeout( () => {
			if (this.props.beforeHandler)
				this.props.beforeHandler();
			if (this.props.onClick) {
                this.props.onClick(e);
				return;
			}
			if (typeof this.props.href == 'function') {
				this.setClicked();
                this.props.href(e);
				return;
			}
			scrlt(0, 300);
            this.context.router.push(this.props.href);
		};
	}

	render() {
		const clses = [];
		clses.push(this.props.classes)
		return (
			<a href={this.props.href} ref="item" onClick={this.onClick} className={clses.join(' ')}>{this.props.children}</a>
		);
	}
}

Link.contextTypes = {
	router: React.PropTypes.object,
};
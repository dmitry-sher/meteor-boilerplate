import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Modal from '../components/common/Modal';
import Lightbox from '../components/common/Lightbox';
import * as util from '../lib/util';
var scrlt = require('jquery.scrollto');

// App component - represents the whole app
export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modal: {
				text: '',
				buttons: []
			},

			lightbox: {
				photo: ''
			}
		}
	}

	componentDidMount() {
		util.registerAppComponent(this);
	}

	showModal(options) {
		var modal = Object.assign({}, options);
		modal = Object.assign(modal, {
			isOpen: true,
			oldScroll: util.getScrollTop()
		})
		var state = {modal};
		this.setState(state, () => {
			scrlt(0, 300);
			if (!options.noBodyClass)
				$('body').addClass('modalOpen');
		});
	}

	showLightbox(options) {
		var state = {
			lightbox: {
				photo: options.photo,
				isOpen: true,
				oldScroll: util.getScrollTop()
			}
		}
		this.setState(state, () => {
			console.log('[app.showLightbox setState.cb]');
			scrlt(0, 300);
			$('body').addClass('modalOpen');
		});
	}

	closeModal() {
		var modal = this.state.modal;
		modal.isOpen = false;
		this.setState({modal}, () => {
			scrlt(modal.oldScroll, 300);
			$('body').removeClass('modalOpen');
		});
	}

	closeLightbox() {
		var lightbox = this.state.lightbox;
		lightbox.isOpen = false;
		this.setState({lightbox}, () => {
			if (this.refs.lightbox)
				this.refs.lightbox.resetZoom();
			scrlt(lightbox.oldScroll, 300);
			$('body').removeClass('modalOpen');
		});
	}

	render() {
		var containerClasses = ['container'];
		var childrenClasses = ['children'];
		if (this.state.lightbox.isOpen)
			childrenClasses.push('hidden');
		return (
			<div className={containerClasses.join(' ')}>
				<div className={childrenClasses.join(' ')}>
					{this.props.children}
				</div>
				<Modal parent={this} {...this.state.modal} />
				<Lightbox parent={this} ref="lightbox" {...this.state.lightbox} />
			</div>
		);
	}
}
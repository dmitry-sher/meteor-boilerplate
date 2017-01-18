import React, { Component } from 'react';
import Link from './Link';

export default class Modal extends Component {

	constructor(props) {
		super(props);

		this.onButtonClick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			var i = $(e.currentTarget).data('i');
			var type = $(e.currentTarget).data('type');
			if (typeof(i) == 'undefined')
				return;
			var b = null;
			if (!type || type == 'main')
				b = this.props.buttons[i];
			if (type == 'footer')
				b = this.props.footerButtons[i];
			if (!b) {
				console.log('[Modal.onButtonClick] failed to find button. i = ', i, ', type = ', type, ', buttons = ', this.props.buttons, ', footerButtons = ', this.props.footerButtons);

				return;
			}
			if (b.onClick)
				b.onClick(e);
			this.props.parent.closeModal();
		}

		this.onOuterClick = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (this.props.mandatoryCallback)
				this.props.mandatoryCallback();
			this.props.parent.closeModal();
		}

		this.getGetButton = (type) =>{
			return (b,i) => {
				let key = `button-${i}`;
				let cls = ['button', 'defaultButton', 'active'];
				if (b.classes) {
					if (typeof(b.classes) == 'string')
						cls.push(b.classes);
					if (typeof(b.classes) == 'object')
						cls.push(...b.classes);
					if (typeof(b.classes) == 'function')
						cls.push(b.classes(b, i));
				}

				return (
					<div key={key} className={cls.join(' ')} data-type={type} data-i={i} onClick={this.onButtonClick}>{b.text}</div>
				);
			};
		}
	}

	render() {
		var classes = ['modalOuter'];
		if (this.props.isOpen)
			classes.push('open');
		if (this.props.classes)
			classes.push(this.props.classes);
		var buttons = this.props.buttons.map(this.getGetButton('main'));
		var title = null;
		if (this.props.title)
			title = (<div className="title fontH2">{this.props.title}</div>);
		
        var footer = null;
		if (this.props.footerButtons) {
			let fbuttons = this.props.footerButtons.map(this.getGetButton('footer'));
			footer = (<div className="footerButtons">{fbuttons}</div>);
			classes.push('withFooter');
		}
		if (this.props.footerText) {
			footer = (<div className="footerText fontH4" dangerouslySetInnerHTML={{__html: this.props.footerText}}></div>);
		}
		var text = null;
		if (this.props.text) {
			let textClasses = ["text", "break", "defaultMessage"];
			if (this.props.textClasses)
				textClasses.push(this.props.textClasses);
			text = ( <div className={textClasses.join(' ')}>{this.props.text}</div> );
		}
		// console.log('[Modal.render] footer = ', footer);
		return (
			<div className={classes.join(' ')}>
				<div className="modal">
					{title}
					{this.props.content}
					{text}
					<div className="buttons">
						{buttons}
					</div>
					{footer}
				</div>
			</div>
		);
	}
}

Modal.propTypes = {
	parent: React.PropTypes.object.isRequired,
	// text: React.PropTypes.string.isRequired,
	buttons: React.PropTypes.array.isRequired
}

Modal.contextTypes = {
	router: React.PropTypes.object
};

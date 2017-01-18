import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Link from '../common/Link';
import { createContainer } from 'meteor/react-meteor-data';
import * as util from '../../lib/util';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			error: false,
			login: '',
			pass: '',
			validated: false,
			focused: false,
			clicked: false
		}

		this.onSubmit = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (!this.state.validated)
				return;
			var user = this.state.login, pass = this.state.pass;

			this.setState({error: false});
			if (!util.showLoader())
				return;
			this.setState({clicked: true});
			$(this.refs.login).blur();
			$(this.refs.pass).blur();
			Meteor.loginWithPassword(user, pass, (err, res) => {
				if (err) {
					util.closeLoader();
					var msg = err.message;
					this.setState({error: msg, clicked: false});
					console.log('[LoginForm.onSubmit error] err = ', err, ', res = ', res);
					return;
				}
				this.context.router.push('/profile');
			});
		}

		this.onLoginChange = (e) => {
			this.setState({login: e.target.value}, this.validate);
		}

		this.onPassChange = (e) => {
			this.setState({pass: e.target.value}, this.validate);
		}

		this.onFocus = (e) => {
			this.setState({focused: true}, this.validate);
		}

		this.onBlur = (e) => {
			this.setState({focused: false}, this.validate);
		}
	}

	componentWillReceiveProps(nextProps) {
	 	if (nextProps.user)
	 		this.context.router.push('/profile');
	}

	componentDidMount() {
	 	util.closeLoader();
	}

	validate() {
		console.log('[LoginForm.validate]')
		var validated = this.state.focused ? (this.state.login != '') :
			(this.state.login && this.state.login.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i));
		var error = !this.state.focused && this.state.login && !validated ?
			'Неверный формат email' :
			this.state.error;
		validated = validated && this.state.login && this.state.pass;
		var state = {validated, error}
		this.setState(state);
	}

	render() {
		var errClasses = ['err', 'fontH3', 'red'];
		if (!this.state.error)
			errClasses.push('hidden');
		var submitClasses = ['submit', 'defaultButton'];
		if (this.state.validated)
			submitClasses.push('active');
		return (
			<div className="loginForm centeredContent">
                <form onSubmit={this.onSubmit}>
                    <input type="email" autoCorrect="off" autoCapitalize="off" name="email" ref="login" placeholder="Ваш Email" className="login defaultInput" onChange={this.onLoginChange} onKeyUp={this.onLoginChange} onFocus={this.onFocus} onBlur={this.onBlur} />
                    <input type="password" name="pass" ref="pass" placeholder="Введите пароль" className="pass defaultInput" onChange={this.onPassChange} onKeyUp={this.onPassChange} />
                    <input type="submit" className={submitClasses.join(' ')} value="Войти" />
                    <div className={errClasses.join(' ')} ref="msg">{this.state.error}</div>
                </form>
			</div>
		);
	}
}

LoginForm.contextTypes = {
	router: React.PropTypes.object
};

export default createContainer(util.getUserMeteorData, LoginForm);
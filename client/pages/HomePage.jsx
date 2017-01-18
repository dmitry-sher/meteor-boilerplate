import React, { Component } from 'react';
import ReactMixin from 'react-mixin';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import * as util from '../lib/util';
import LoginForm from '../components/accounts/LoginForm';

@ReactMixin(ReactMeteorData)
class HomePage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			waited: false
		}

		this.waitedForData = false;
	}

	componentDidMount() {
		if (this.props.user)
			this.context.router.push('/profile');
	}

	componentWillReceiveProps(nextProps) {
	 	if (nextProps.user)
			this.context.router.push('/profile');
	}

	shouldWeShowLogin() {
		let hasUserData = this.props.user;
		let st = localStorage.getItem('Meteor.loginToken');
		console.log('[HomePage.shouldWeShowLogin] hasUserData = ', hasUserData, ', st = ', st);
		if (!hasUserData) {
			if (this.waitedForData)
				return true;
			if (st) {
				util.showLoader({force: true});
				setTimeout(() => {
					this.waitedForData = true;
					this.setState({waited: true});
				}, 5000);
				return false;
			}
			return true;
		}
		return this.props.loggingIn || !hasUserData;
	}

	render() {
		if (this.shouldWeShowLogin())
			return (
				<LoginForm />
			);
		if (this.props.user) {
			return null;
			// return (
			// 	<ProfileInfo />
			// );
		};
		return null;
	}
}

HomePage.contextTypes = {
	router: React.PropTypes.object
};

export default createContainer(util.getUserMeteorData, HomePage);
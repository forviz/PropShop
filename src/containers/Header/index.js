import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import FontAwesome from 'react-fontawesome';
import logo from '../../images/logo.png';
import * as firebase from '../../api/firebase';

class Header extends Component {

	state = {
		user: {},
		showMobileMenu: false,
	}

	componentDidMount() {
		const _self = this;
		firebase.core().auth().onAuthStateChanged(function(user) {
		  if (user) {
		  	_self.setState(prevState => ({
		      user: user,
		    }));
		  }
		});
	}

	handleMobileMenu = () => {
		this.setState(prevState => ({
      showMobileMenu: !prevState.showMobileMenu,
    }));
	}

	logout = () => {
		const _self = this;
		firebase.core().auth().signOut().then(function() {
		  _self.setState(prevState => ({
	      user: {},
	    }));
		}).catch(function(error) {
		  console.log('error', error);
		});
	}

	handleMenuClick = (value) => {
		if ( value.key === 'logout' ) {
			this.logout();
		}
	}

  render() {

  	const { user, showMobileMenu } = this.state;
  	const { translate, dispatch } = this.props;

  	let loginLabel = 
  										<NavLink exact to="/login">
				            		<FontAwesome name='user-o' />
				            		{translate('เข้าสู่ระบบ')}
				            	</NavLink>

		if ( user.email ) {
			const menu = (
			  <Menu onClick={this.handleMenuClick}>
			    <Menu.Item key="profile">
			    	<NavLink exact to="/">Profile</NavLink>
			    </Menu.Item>
			    <Menu.Divider />
			    <Menu.Item key="logout">Logout</Menu.Item>
			  </Menu>
			);
			loginLabel = 	
									<Dropdown overlay={menu} trigger={['click']}>
								    <a className="ant-dropdown-link" href="#">
								      {user.email} <Icon type="down" />
								    </a>
								  </Dropdown>
		}

    return (
      <nav id="Header" className="navbar navbar-default navbar-fixed-top">
	      <div className="container">
	        <div className="navbar-header">
	          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" onClick={this.handleMobileMenu}>
	            <span className="sr-only">Toggle navigation</span>
	            <span className="icon-bar"></span>
	            <span className="icon-bar"></span>
	            <span className="icon-bar"></span>
	          </button>
	          <NavLink className="navbar-brand" exact to="/">
	          	<img src={logo} alt="PropShop" />
	          </NavLink>
	        </div>
	        <div id="navbar" className={"navbar-collapse collapse " + (showMobileMenu ? 'in' : '')}>
	          <ul className="nav navbar-nav">
	            <li><NavLink exact to="/">{translate('ต้องการซื้อ - เช่า')}</NavLink></li>
	            <li><NavLink exact to="/sell">{translate('ประกาศขาย - เช่า')}</NavLink></li>
	            <li><NavLink exact to="/agent">{translate('ค้นหานายหน้า')}</NavLink></li>
	            <li><NavLink exact to="/news">{translate('ข่าวสารและบทความ')}</NavLink></li>
	            <li><NavLink exact to="/webboard">{translate('เว็บบอร์ด')}</NavLink></li>
	          </ul>
	          <ul className="nav navbar-nav navbar-right">
	            <li className="language"><a onClick={(e) => { dispatch(IntlActions.setLocale('th')) }}>ไทย</a></li>
	            <li className="language last"><a onClick={(e) => { dispatch(IntlActions.setLocale('en')) }}>ENG</a></li>
	            <li className="login">
	            	{loginLabel}
	            </li>
	          </ul>
	        </div>
	      </div>
	    </nav>
    );
  }
}

export default connect()(withTranslate(Header));
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate, IntlActions } from 'react-redux-multilingual';

import FontAwesome from 'react-fontawesome';

import logo from '../../images/logo.png';

class Header extends Component {

	state = {
		showMobileMenu: false,
	}

	handleMobileMenu = () => {
		this.setState(prevState => ({
      showMobileMenu: !prevState.showMobileMenu,
    }));
	}

  render() {
  	const { translate, dispatch } = this.props;
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
	        <div id="navbar" className={"navbar-collapse collapse " + (this.state.showMobileMenu ? 'in' : '')}>
	          <ul className="nav navbar-nav">
	            <li><NavLink exact to="/">{translate('หน้าแรก')}</NavLink></li>
	            <li><NavLink exact to="/sell">{translate('ประกาศขาย - เช่า')}</NavLink></li>
	            <li><NavLink exact to="/agent">{translate('ค้นหานายหน้า')}</NavLink></li>
	            <li><NavLink exact to="/news">{translate('ข่าวสารและบทความ')}</NavLink></li>
	            <li><NavLink exact to="/webboard">{translate('เว็บบอร์ด')}</NavLink></li>
	          </ul>
	          <ul className="nav navbar-nav navbar-right">
	            <li className="language"><a onClick={(e) => { dispatch(IntlActions.setLocale('th')) }}>ไทย</a></li>
	            <li className="language last"><a onClick={(e) => { dispatch(IntlActions.setLocale('en')) }}>ENG</a></li>
	            <li className="login">
	            	<NavLink exact to="/login">
	            		<FontAwesome name='user-o' />
	            		{translate('เข้าสู่ระบบ')}
	            	</NavLink>
	            </li>
	          </ul>
	        </div>
	      </div>
	    </nav>
    );
  }
}

export default connect()(withTranslate(Header));

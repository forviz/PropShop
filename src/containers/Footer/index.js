import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import FontAwesome from 'react-fontawesome';

import logo from '../../images/only_logo.png';

class Footer extends Component {
  render() {
  	const { translate } = this.props;
    return (
      <div id="Footer">
      	<div className="row_1 clearfix menu">
      		<div className="menu-left pull-left">
		        <ul>
		        	<li><NavLink exact to="/">{translate('ต้องการซื้อ - เช่า')}</NavLink></li>
	            <li><NavLink exact to="/sell">{translate('ประกาศขาย - เช่า')}</NavLink></li>
	            <li><NavLink exact to="/agent">{translate('ค้นหานายหน้า')}</NavLink></li>
	            <li><NavLink exact to="/news">{translate('ข่าวสารและบทความ')}</NavLink></li>
	            <li><NavLink exact to="/webboard">{translate('เว็บบอร์ด')}</NavLink></li>
		        </ul>
	        </div>
	        <div className="menu-right pull-right">
		        <ul>
		        	<li><NavLink exact to="/">Terms & Condition</NavLink></li>
		        	<li><NavLink exact to="/">Privacy Policy</NavLink></li>
		        </ul>
	        </div>
	      </div>
	      <div className="row_2 clearfix">
	      	<div className="copyright pull-left">
	      		<div className="logo">
	      			<img src={logo} alt="PROPSHOP" />
	      		</div>
	      		<div className="text">
	      			Copyright ©2017 PROP<span className="text-green">SHOP</span> All rights reserved
	      		</div>
	      	</div>
	      	<div className="social-media pull-right">
	      		<ul>
	      			<li className="facebook"><a href="#" target="_blank"><FontAwesome name="facebook" /></a></li>
	      			<li className="google-plus"><a href="#" target="_blank"><FontAwesome name="google-plus" /></a></li>
	      			<li className="twitter"><a href="#" target="_blank"><FontAwesome name="twitter" /></a></li>
	      		</ul>
	      	</div>
	      </div>
      </div>
    );
  }
}

export default connect()(withTranslate(Footer));

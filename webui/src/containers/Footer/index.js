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
        <div className="row row_1">
          <div className="col-sm-7">
            <div className="menu-left">
              <ul>
                <li><NavLink exact to="/condominium/for-sale/bangkok">{translate('ต้องการซื้อ - เช่า')}</NavLink></li>
                <li><NavLink exact to="/sell">{translate('ประกาศขาย - เช่า')}</NavLink></li>
                {/*<li><NavLink exact to="/agent">{translate('ค้นหานายหน้า')}</NavLink></li>*/}
                <li><NavLink exact to="/news">{translate('ข่าวสารและบทความ')}</NavLink></li>
                {/*<li><NavLink exact to="/webboard">{translate('เว็บบอร์ด')}</NavLink></li>*/}
              </ul>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="menu-right">
              <ul>
                <li><NavLink exact to="/">Terms & Condition</NavLink></li>
                <li><NavLink exact to="/">Privacy Policy</NavLink></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="row row_2">
          <div className="col-sm-7">
            <div className="copyright">
              <div className="logo">
                <img src={logo} alt="PROPSHOP" />
              </div>
              <div className="text">
                Copyright ©2017 PROP<span className="text-green">SHOP</span> All rights reserved
              </div>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="social-media">
              <ul>
                <li className="facebook"><a href="#" target="_blank"><FontAwesome name="facebook" /></a></li>
                <li className="google-plus"><a href="#" target="_blank"><FontAwesome name="google-plus" /></a></li>
                <li className="twitter"><a href="#" target="_blank"><FontAwesome name="twitter" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(withTranslate(Footer));

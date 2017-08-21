import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Dropdown, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import logo from '../../images/logo.png';

import * as UserActions from '../../actions/user-actions';

class Header extends Component {

  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    translate: PropTypes.func.isRequired,
    user: PropTypes.shape().isRequired,
    actions: PropTypes.shape().isRequired,
    userFetchSuccess: PropTypes.bool,
  }

  state = {
    showMobileMenu: false,
  }

  handleMobileMenu = () => {
    this.setState(prevState => ({
      showMobileMenu: !prevState.showMobileMenu,
    }));
  }

  logout = () => {
    const { firebase } = this.props;
    const { emptyUser } = this.props.actions;
    firebase.logout();
    emptyUser();
  }

  handleMenuClick = (value) => {
    if (value.key === 'logout') {
      this.logout();
    }
  }

  render() {
    const { showMobileMenu } = this.state;
    const { user, userFetchSuccess, translate, dispatch, mobileMode } = this.props;

    if (!userFetchSuccess) return <div />;

    let loginLabel = null;
    let divAvatar = null;

    if (user.username && user.verify) {
      const menu = (
        <Menu onClick={this.handleMenuClick} className="user-menu">
          <Menu.Item key="property">
            <NavLink exact to="/account/property">รายการที่ประกาศ</NavLink>
          </Menu.Item>
          <Menu.Item key="wishlist">
            <NavLink exact to="/account/wishlist">รายการที่บันทึกไว้</NavLink>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="profile">
            <NavLink exact to="/account/profile">การตั้งค่าบัญชีผู้ใช้</NavLink>
          </Menu.Item>
          <Menu.Item key="changepassword">
            <NavLink exact to="/account/changepassword">เปลี่ยนรหัสผ่าน</NavLink>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout">ออกจากระบบ</Menu.Item>
        </Menu>
      );

      if (_.get(user, 'image.fields.file.url')) {
        divAvatar = (
          <div className="avatar">
            <img src={user.image.fields.file.url} alt={user.image.fields.file.fileName} className="img-circle" />
          </div>
        );
      } else {
        divAvatar = <FontAwesome name="user-o" />;
      }

      loginLabel = (
        <Dropdown overlay={menu} trigger={['click']}>
          <a className="ant-dropdown-link">
            {divAvatar} {user.username} <Icon type="down" />
          </a>
        </Dropdown>
      );
    } else {
      loginLabel = (
        <NavLink exact to="/login">
          <FontAwesome name="user-o" />
          {translate('เข้าสู่ระบบ')}
        </NavLink>
      );
    }

    return (
      <nav id="Header" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button
              type="button"
              className={`navbar-toggle ${showMobileMenu ? '' : 'collapsed'}`}
              data-toggle="collapse"
              data-target="#navbar"
              aria-expanded={showMobileMenu ? 'true' : 'false'}
              aria-controls="navbar"
              onClick={this.handleMobileMenu}
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <NavLink className="navbar-brand" exact to="/">
              <img src={logo} alt="PropShop" />
            </NavLink>
          </div>
          <div id="navbar" className={`navbar-collapse collapse ${showMobileMenu ? 'in' : ''}`}>
            {mobileMode && user.username && user.verify ? (
              <ul className="nav navbar-nav">
                <li><NavLink exact to="/">{translate('ต้องการซื้อ - เช่า')}</NavLink></li>
                <li><NavLink exact to="/sell">{translate('ประกาศขาย - เช่า')}</NavLink></li>
                { /* <li><NavLink exact to="/agent">{translate('ค้นหานายหน้า')}</NavLink></li> */ }
                <li><NavLink exact to="/news">{translate('ข่าวสารและบทความ')}</NavLink></li>
                <li role="separator" className="divider" />
                <li className="dropdown-header">บัญชีผู้ใช้</li>
                <li><NavLink exact to="/account/property">รายการที่ประกาศ</NavLink></li>
                <li><NavLink exact to="/account/wishlist">รายการที่บันทึกไว้</NavLink></li>
                <li><NavLink exact to="/account/profile">การตั้งค่าบัญชีผู้ใช้</NavLink></li>
                <li><NavLink exact to="/account/profile">การตั้งค่าบัญชีผู้ใช้</NavLink></li>
                <li><NavLink exact to="/account/changepassword">เปลี่ยนรหัสผ่าน</NavLink></li>
                <li role="separator" className="divider" />
                <li><a role="button" tabIndex="0" onClick={() => this.logout()}>ออกจากระบบ</a></li>
              </ul>
            ) : (
              <ul className="nav navbar-nav">
                <li><NavLink exact to="/">{translate('ต้องการซื้อ - เช่า')}</NavLink></li>
                <li><NavLink exact to="/sell">{translate('ประกาศขาย - เช่า')}</NavLink></li>
                { /* <li><NavLink exact to="/agent">{translate('ค้นหานายหน้า')}</NavLink></li> */ }
                <li><NavLink exact to="/news">{translate('ข่าวสารและบทความ')}</NavLink></li>
                { /* <li><NavLink exact to="/webboard">{translate('เว็บบอร์ด')}</NavLink></li> */ }
              </ul>
            )}
            <ul className="nav navbar-nav navbar-right">
              {/* <li className="language">
                <a role="button" tabIndex="0" onClick={() => { dispatch(IntlActions.setLocale('th')); }}>ไทย</a>
              </li>
              <li className="language last">
                <a role="button" tabIndex="0" onClick={() => { dispatch(IntlActions.setLocale('en')); }}>ENG</a>
              </li> */}
              {!mobileMode &&
                <li className="login">
                  {loginLabel}
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
    userFetchSuccess: state.user.fetchSuccess,
    mobileMode: state.core.mobileMode,
  };
};

const actions = {
  emptyUser: UserActions.emptyUser,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(withTranslate(Header));

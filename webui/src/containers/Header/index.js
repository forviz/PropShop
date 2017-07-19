import React, { Component } from 'react';
import { Menu, Dropdown, Icon } from 'antd';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withTranslate, IntlActions } from 'react-redux-multilingual';
import FontAwesome from 'react-fontawesome';
import logo from '../../images/logo.png';

import * as UserActions from '../../actions/user-actions';

class Header extends Component {

  state = {
    showMobileMenu: false,
  }

  handleMobileMenu = () => {
    this.setState(prevState => ({
      showMobileMenu: !prevState.showMobileMenu,
    }));
  }

  logout = () => {
    const { history } = this.props;
    history.push({
      pathname: '/',
    });

    const { logout } = this.props.actions;
    logout();
  }

  handleMenuClick = (value) => {
    if ( value.key === 'logout' ) {
      this.logout();
    }
  }

  render() {

    const { showMobileMenu } = this.state;
    const { user, translate, dispatch } = this.props;

    let loginLabel = null;

    if (user.username) {
      const menu = (
        <Menu onClick={this.handleMenuClick}>
          <Menu.Item key="wishlist">
            <NavLink exact to="/wishlist">รายการประกาศที่บันทึกไว้</NavLink>
          </Menu.Item>
          <Menu.Item key="profile">
            <NavLink exact to="/profile">การตั้งค่าบัญชีผู้ใช้</NavLink>
          </Menu.Item>
          <Menu.Item key="changepassword">
            <NavLink exact to="/changepassword">เปลี่ยนรหัสผ่าน</NavLink>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout">ออกจากระบบ</Menu.Item>
        </Menu>
      );

      let divAvatar = null;
      if ( user.image ) {
        divAvatar = 
                  <div className="avatar">
                    <img src={user.image.fields.file.url} alt={user.image.fields.file.fileName} className="img-circle" />
                  </div>
      } else {
        divAvatar = <FontAwesome name='user-o' />
      }

      loginLabel = 	
                  <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link user-menu">
                      {divAvatar} {user.username} <Icon type="down" />
                    </a>
                  </Dropdown>
    } else {
      loginLabel = 
                  <NavLink exact to="/login">
                    <FontAwesome name='user-o' />
                    {translate('เข้าสู่ระบบ')}
                  </NavLink>
    }

    return (
      <nav id="Header" className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className={"navbar-toggle " + (showMobileMenu ? '' : 'collapsed')} data-toggle="collapse" data-target="#navbar" aria-expanded={showMobileMenu ? 'true' : 'false'} aria-controls="navbar" onClick={this.handleMobileMenu}>
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

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

const actions = {
  logout: UserActions.logout,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Header));
import React, { Component } from 'react';
import T from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Menu, Icon, notification } from 'antd';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import AccountPages from './Pages';

const SubMenu = Menu.SubMenu;

class Account extends Component {

  static propTypes = {
    match: T.shape().isRequired,
    location: T.shape().isRequired,
    history: T.shape().isRequired,
    firebase: T.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.checkLogin();
  }

  checkLogin = () => {
    const { firebase, history } = this.props;
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        notification.error({ message: 'กรุณาเข้าสู่ระบบก่อน' });
        history.push({ pathname: '/' });
      }
    });
  }

  render() {
    const page = this.props.match.params.page;
    const param = queryString.parse(this.props.location.search);

    return (
      <div id="Account">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <Menu
                style={{ width: 240 }}
                defaultSelectedKeys={[page]}
                defaultOpenKeys={['sub1', 'sub2']}
                mode="inline"
              >
                <SubMenu key="sub1" title={<span><Icon type="home" /><span>ข้อมูลอสังหาฯ</span></span>}>
                  <Menu.Item key="property"><NavLink exact to="/account/property">รายการที่ประกาศ</NavLink></Menu.Item>
                  <Menu.Item key="wish-list"><NavLink exact to="/account/wishlist">รายการที่บันทึกไว้</NavLink></Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" title={<span><Icon type="user" /><span>ข้อมูลส่วนตัว</span></span>}>
                  <Menu.Item key="profile"><NavLink exact to="/account/profile">ตั้งค่าบัญชีผู้ใช้</NavLink></Menu.Item>
                  <Menu.Item key="changepassword"><NavLink exact to="/account/changepassword">เปลี่ยนรหัสผ่าน</NavLink></Menu.Item>
                </SubMenu>
              </Menu>
            </div>
            <div className="col-md-9">
              <AccountPages page={page} param={param} history={this.props.history} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const actions = {};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(Account);

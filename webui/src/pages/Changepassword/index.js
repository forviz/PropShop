import React, { Component } from 'react';
import { Input, Spin, Alert } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as firebase from '../../api/firebase';
import * as UserActions from '../../actions/user-actions';
import MemberInfo from '../../containers/MemberInfo';

class Changepassword extends Component {

  constructor(props) {
    super(props);
    this.getProfile(props);
  }

  getProfile = (props) => {

    firebase.core().auth().onAuthStateChanged((user) => {

      if (!user) {

        // notification['error']({
        //   message: 'กรุณาเข้าสู่ระบบก่อน',
        // });

        const { history } = props;
        history.push({
          pathname: '/',
        });

      }

      const { fetchUser } = this.props.actions;
      fetchUser();

    });
  }

  setInput = (key, value) => {
    const { inputFormChangepassowrd } = this.props.actions;
    inputFormChangepassowrd(key, value);
  }

  handleInputPassword1 = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.password1,
      value: value,
    }
    this.setInput('password1', data);
  }

  handleInputPassword2 = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.password2,
      value: value,
    }
    this.setInput('password2', data);
  }

  checkPassword = (password1, password2) => {
    let errorMessage = '';
    if ( password1 || password2 ) {
      if ( password1 !== password2 ) {
        errorMessage = 'รหัสผ่านไม่ตรงกัน';
      }
    } else {
      errorMessage = 'กรุณากรอกรหัสผ่าน';
    }
    const { setPasswordError } = this.props.actions;
    setPasswordError(errorMessage);
    return errorMessage;
  }

  submit = () => {

    const { editing } = this.props;

    if (editing === true) {
      return;
    }

    const _self = this;
    const { data } = this.props;
    const errorPassword = this.checkPassword(data.password1.value, data.password2.value);

    if (errorPassword === '') {
      const { changePassword } = this.props.actions;
      changePassword(data.password1.value);
    }
  }

  render() {
    const { data, editing, editSuccess, errorMessage } = this.props;

    return (
      <div id="Changepassword">
        <div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            <MemberInfo />
          </div>
          <div className="col-md-6 col-md-offset-6">
            <div className="layout-right">
              <Spin tip="Loading..." spinning={editing}>
                <div className="layout-container">
                  <h1>เปลี่ยนรหัสผ่าน</h1>
                  {editSuccess === true &&
                    <div className="form-group" style={{ marginTop: 20 }}>
                      <Alert
                        message="เปลี่ยนรหัสผ่านสำเร็จ"
                        type="success"
                        showIcon
                      />
                    </div>
                  }
                  <div className="form">
                    <section>
                      <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                          {errorMessage &&
                            <div className="form-group">
                              <Alert
                                message={errorMessage}
                                type="error"
                                showIcon
                              />
                            </div>
                          }
                          <div className="form-group">
                            <label>รหัสผ่านใหม่</label>
                            <Input type="password" onChange={this.handleInputPassword1} value={data.password1.value} />
                          </div>
                          <div className="form-group">
                            <label>ยืนยันรหัสผ่านใหม่</label>
                            <Input type="password" onChange={this.handleInputPassword2} value={data.password2.value} />
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="btn-action">
                    <button className="btn btn-primary" onClick={this.submit} >เปลี่ยนรหัสผ่าน</button>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    editing: state.form.changepassword.editing,
    editSuccess: state.form.changepassword.editSuccess,
    errorMessage: state.form.changepassword.errorMessage,
    data: state.form.changepassword.data,
    user: state.user.data,
  };
};

const actions = {
  fetchUser: UserActions.fetchUser,
  inputFormChangepassowrd: UserActions.inputFormChangepassowrd,
  setPasswordError: UserActions.setPasswordError,
  changePassword: UserActions.changePassword,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Changepassword);

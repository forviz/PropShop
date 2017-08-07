import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Spin, Alert } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect, pathToJS } from 'react-redux-firebase';
import _ from 'lodash';

import * as ChangepasswordActions from '../../../actions/changepassword-actions';

class Changepassword extends Component {

  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    actions: PropTypes.shape().isRequired,
    data: PropTypes.shape().isRequired,
    editing: PropTypes.bool.isRequired,
    editSuccess: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    errorMessage: PropTypes.string.isRequired,
    // authError: PropTypes.shape(),
  }

  setInput = (key, value) => {
    const { inputForm } = this.props.actions;
    inputForm(key, value);
  }

  handleInputPassword1 = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.password1,
      value,
    };
    this.setInput('password1', data);
  }

  handleInputPassword2 = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.password2,
      value,
    };
    this.setInput('password2', data);
  }

  checkPassword = (password1, password2) => {
    let errorMessage = '';
    if (password1 || password2) {
      if (password1 !== password2) {
        errorMessage = 'รหัสผ่านไม่ตรงกัน';
      }
    } else {
      errorMessage = 'กรุณากรอกรหัสผ่าน';
    }
    const { changePasswordError } = this.props.actions;
    changePasswordError(errorMessage);
    return errorMessage;
  }

  submit = () => {
    const { editing, firebase } = this.props;

    if (editing === true) {
      return;
    }

    const { data } = this.props;
    const errorPassword = this.checkPassword(data.password1.value, data.password2.value);

    if (errorPassword === '') {
      const user = firebase.auth().currentUser;
      const { changePassword } = this.props.actions;
      changePassword(user, data.password1.value);
      // firebase.resetPassword({
      //   email: user.email,
      //   password: data.password1.value,
      //   username: user.username,
      // });
    }
  }

  render() {
    const { data, user, editing, editSuccess, errorMessage, authError } = this.props;

    return (
      <div id="Changepassword">
        <div className="row">
          <div className="col-md-12">
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
                  {errorMessage &&
                    <div className="form-group">
                      <Alert
                        message={errorMessage}
                        type="error"
                        showIcon
                      />
                    </div>
                  }
                  <div className="form">
                    <section>
                      <div className="row">
                        <div className="col-md-6 col-md-offset-3">
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
    editing: state.domain.accountChangepassword.editing,
    editSuccess: state.domain.accountChangepassword.editSuccess,
    errorMessage: state.domain.accountChangepassword.errorMessage,
    data: state.domain.accountChangepassword.data,
    user: state.user.data,
    authError: pathToJS(state.firebase, 'authError'),
  };
};

const actions = {
  inputForm: ChangepasswordActions.inputForm,
  changePassword: ChangepasswordActions.changePassword,
  changePasswordError: ChangepasswordActions.changePasswordError,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(Changepassword);

import React, { Component } from 'react';
import { Select, Input, Spin, Alert, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FontAwesome from 'react-fontawesome';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

import * as firebase from '../../api/firebase';
import * as UserActions from '../../actions/user-actions';
import MemberInfo from '../../containers/MemberInfo';

const Option = Select.Option;

class Profile extends Component {

  constructor(props) {
    super(props);
    this.getProfile(props);
  }

  getProfile = (props) => {

    firebase.core().auth().onAuthStateChanged((userFirebase) => {

      if (!userFirebase) {

        notification['error']({
          message: 'กรุณาเข้าสู่ระบบก่อน',
        });

        const { history } = props;
        history.push({
          pathname: '/',
        });
        
      }

      const { fetchUserProfile } = this.props.actions;
      fetchUserProfile(userFirebase);

    });
  }

  setInput = (key, value) => {
    const { inputUserData } = this.props.actions;
    inputUserData(key, value);
  }

  handleInputEmail = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.email,
      value: value,
    }
    this.setInput('email', data);
  }

  handleInputUsername = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.username,
      value: value,
    }
    this.setInput('username', data);
  }

  handleChangePrefixName = (value) => {
    const data = {
      ...this.props.data.prefixName,
      value: value,
    }
    this.setInput('prefixName', data);
  }

  handleInputName = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.name,
      value: value,
    }
    this.setInput('name', data);
  }

  handleInputLastname = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.lastname,
      value: value,
    }
    this.setInput('lastname', data);
  }

  handleInputPhone = (e) => {
    const value = e.target.value;
    const data = {
      ...this.props.data.phone,
      value: value.replace(/\D/g, ''),
    }
    this.setInput('phone', data);
  }

  handleInputImage = (accepted, rejected) => {

    this.setState({
      image: {
        errorMessage: accepted.length > 0 ? false : true,
      }
    });

    if ( accepted.length > 0 ) {
      const data = {
        ...this.props.data.image,
        value: {
          ...this.props.data.image.value,
          fields: {
            ...this.props.data.image.value.fields,
            file: {
              ...this.props.data.image.value.fields.file,
              url: accepted[0].preview,
            },
            title: accepted[0].name
          },
          newImage: accepted[0],
        }
      }
      this.setInput('image', data);
    }
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

  checkEmail = (email) => {
    let errorMessage = email === '' || email === undefined ? 'กรุณากรอกอีเมล' : '';
    const data = {
      ...this.props.data.email,
      errorMessage: errorMessage,
    }
    this.setInput('email', data);
    return errorMessage;
  }

  checkPrefixName = (prefixName) => {
    const errorMessage = prefixName === '' || prefixName === undefined ? 'กรุณาเลือกคำนำหน้า' : '';
    const data = {
      ...this.props.data.prefixName,
      errorMessage: errorMessage,
    }
    this.setInput('prefixName', data);
    return errorMessage;
  }

  checkUsername = (username) => {
    const errorMessage = username === '' || username === undefined ? 'กรุณากรอกชื่อสมาชิก' : '';
    const data = {
      ...this.props.data.username,
      errorMessage: errorMessage,
    }
    this.setInput('username', data);
    return errorMessage;
  }

  checkName = (name) => {
    const errorMessage = name === '' || name === undefined ? 'กรุณากรอกชื่อจริง' : '';
    const data = {
      ...this.props.data.name,
      errorMessage: errorMessage,
    }
    this.setInput('name', data);
    return errorMessage;
  }

  checkLastname = (lastname) => {
    const errorMessage = lastname === '' || lastname === undefined ? 'กรุณากรอกนามสกุล' : '';
    const data = {
      ...this.props.data.lastname,
      errorMessage: errorMessage,
    }
    this.setInput('lastname', data);
    return errorMessage;
  }

  checkPhone = (phone) => {
    let errorMessage = phone === '' || phone === undefined ? 'กรุณากรอกเบอร์มือถือ' : '';

    if (errorMessage === '') {
      const re = /^\d{9}$/;
      if (!re.test(phone)) {
        errorMessage = 'เบอร์มือถือไม่ถูกต้อง';
      }
    }

    const data = {
      ...this.props.data.phone,
      errorMessage: errorMessage,
    }
    this.setInput('phone', data);
    return errorMessage;
  }

  checkPassword = (password1, password2) => {
    let errorMessage = '';
    if ( password1 || password2 ) {
      if ( password1 !== password2 ) {
        errorMessage = 'รหัสผ่านไม่ตรงกัน';
      }
    }
    const data = {
      ...this.props.data.password1,
      errorMessage: errorMessage,
    }
    this.setInput('password1', data);
    return errorMessage;
  }

  errorMessageTemplate = (message) => {
    if (!message) return message;
    return <span className="text-red">{message}</span>
  }

  getOnlyValue = (data) => {
    return _.reduce(data, (acc, elem, index) => {
      return {
        ...acc,
        [index]: elem.value,
      };
    }, {});
  }

  submit = () => {

    const { editing } = this.props;

    if ( editing === true ) {
      return;
    }

    const _self = this;
    const { data, user } = this.props;

    // const errorEmail = this.checkEmail(data.email.value);
    const errorUsername = this.checkUsername(data.username.value);
    const errorPrefixName = this.checkPrefixName(data.prefixName.value);
    const errorName = this.checkName(data.name.value);
    const errorLastname = this.checkLastname(data.lastname.value);
    const errorPhone = this.checkPhone(data.phone.value);
    const errorPassword = this.checkPassword(data.password1.value, data.password2.value);

    if ( errorUsername === '' && 
        errorPrefixName === '' && 
        errorName === '' && 
        errorLastname === '' && 
        errorPhone === '' &&
        errorPassword === '' 
      ) {

      const { updateUserProfile } = this.props.actions;
      updateUserProfile(user.id, this.getOnlyValue(data));

      // if ( data.password1.value && data.password2.value ) {
      //   firebase.core().auth().currentUser.updatePassword(data.password1.value).then(function() {
      //     updateUserProfile(user.id, this.getOnlyValue(data));
      //   }, function(error) {
      //     console.log('error', error);
      //   });
      // } else {
      //   updateUserProfile(user.id, this.getOnlyValue(data));
      // }

    }

  }
  

  render() {

    const { user, data, editing, editSuccess } = this.props;

    if (Object.keys(data).length === 0) return <div/>;

    return (
      <div id="Profile">
        <div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            <MemberInfo />
          </div>
          <div className="col-md-6 col-md-offset-6">
            <div className="layout-right">
              <Spin tip="Loading..." spinning={editing}>
                <div className="layout-container">
                  <h1>แก้ไขข้อมูลส่วนตัว</h1>
                  {editSuccess === true &&
                    <div className="form-group" style={{ marginTop: 20 }}>
                      <Alert
                        message="แก้ไขข้อมูลส่วนตัวสำเร็จ"
                        type="success"
                        showIcon
                      />
                    </div>
                  }
                  <div className="form">
                    <section>
                      <div className="title">ข้อมูลทั่วไป</div>
                      <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                          <div className="form-group">
                            <label><span className="text-red">*</span> อีเมล {this.errorMessageTemplate(data.email.errorMessage)}</label>
                            <Input disabled={true} value={data.email.value} />
                          </div>
                          <div className="form-group">
                            <label><span className="text-red">*</span> ชื่อสมาชิก {this.errorMessageTemplate(data.username.errorMessage)}</label>
                            <Input onChange={this.handleInputUsername} value={data.username.value} />
                          </div>
                          <div className="form-group">
                            <label><span className="text-red">*</span> คำนำหน้า {this.errorMessageTemplate(data.prefixName.errorMessage)}</label>
                            <div>
                              <Select className="prefixName" placeholder="เลือก" onChange={this.handleChangePrefixName} style={{ width: 100 }} value={data.prefixName.value === '' ? [] : data.prefixName.value} >
                                <Option value="นาย">นาย</Option>
                                <Option value="นาง">นาง</Option>
                                <Option value="นางสาว">นางสาว</Option>
                              </Select>
                            </div>
                          </div>
                          <div className="form-group">
                            <label><span className="text-red">*</span> ชื่อจริง {this.errorMessageTemplate(data.name.errorMessage)}</label>
                            <Input onChange={this.handleInputName} value={data.name.value} />
                          </div>
                          <div className="form-group">
                            <label><span className="text-red">*</span> นามสกุล {this.errorMessageTemplate(data.lastname.errorMessage)}</label>
                            <Input onChange={this.handleInputLastname} value={data.lastname.value} />
                          </div>
                          <div className="form-group form-group-phone">
                            <label><span className="text-red">*</span> เบอร์มือถือ {this.errorMessageTemplate(data.phone.errorMessage)}</label>
                            <div className="row">
                              <div className="col-md-6">
                                <Select className="prefixPhone" style={{ width: '100%' }} value={data.prefixPhone.value} >
                                  <Option value="0">ประเทศไทย (+66)</Option>
                                </Select>
                              </div>
                              <div className="col-md-6">
                                <Input onChange={this.handleInputPhone} value={data.phone.value} maxLength="9" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className="title">รูปสมาชิก</div>
                      <div className="row">
                        <div className="col-md-6 col-md-offset-3">
                          <div className="form-group">
                            <label className={data.image.errorMessage === true ? 'text-red' : ''}>รูปควรมีขนาดไม่เกิน 500 kb. และเป็นไฟล์นามสกุล .gif, .jpg หรือ .png</label>
                            <Dropzone className={"uploadImage-block " + (data.image.value.fields.file.url ? 'has-image' : '')} accept="image/jpeg, image/png , image/gif" maxSize={500000} multiple={false}  onDrop={(accepted, rejected) => { this.handleInputImage(accepted, rejected) }} >
                              {data.image.value.fields.file.url ? (
                                <img src={data.image.value.fields.file.url} alt={data.image.value.fields.title} />
                              ) : (
                                <div className="uploadImage-bg">
                                  <FontAwesome name="user" />
                                </div>
                              )}
                            </Dropzone>
                          </div>
                        </div>
                      </div>
                    </section>
                    <div className="btn-action">
                      <button className="btn btn-primary" onClick={this.submit} >บันทึกการเปลี่ยนแปลง</button>
                    </div>
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
    editing: state.form.profile.editing,
    editSuccess: state.form.profile.editSuccess,
    errorMessage: state.form.profile.errorMessage,
    data: state.form.profile.data,
    user: state.user.data,
  };
};

const actions = {
  fetchUserProfile: UserActions.fetchUserProfile,
  inputUserData: UserActions.inputUserData,
  updateUserProfile: UserActions.updateUserProfile,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

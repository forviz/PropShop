import React, { Component } from 'react';
import T from 'prop-types';
import { Steps, Spin, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as firebase from '../../api/firebase';
import * as SellActions from '../../actions/sell-actions';
import * as UserActions from '../../actions/user-actions';

import DevTool from './DevTool';
import Step0 from './step0';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

const Step = Steps.Step;

const steps = [
   { title: 'รายละเอียดทรัพย์สิน' },
   { title: 'คุณสมบัติพิเศษ' },
   { title: 'อัพโหลดรูปภาพ' },
   { title: 'ข้อตกลงและเงื่อนไข' },
];

class Sell extends Component {

  static propTypes = {
    sell: T.shape({
      redirect: T.bool,
    }),
  }
  constructor(props) {
    super(props);
    this.getProfile(props);
  }

  componentWillReceiveProps(nextProps) {
    const { sell, history } = this.props;
    if (sell.redirect === true) {
      history.push({
        pathname: '/',
      });
    }
  }

  getProfile = (props) => {
    firebase.core().auth().onAuthStateChanged((user) => {
      if (user) {
        const { fetchUserProfile } = props.actions;
        fetchUserProfile(user);
      } else {
        notification.error({
          message: 'กรุณาเข้าสู่ระบบก่อน',
        });
        const { history } = props;
        history.push({
          pathname: '/login',
        });
      }
    });
  }

  openNotificationWithIcon = (type, message, description) => {
    const data = {};
    data.message = message;
    if (description) data.description = description;
    notification[type](data);
  }

  prevStep = () => {
    const { prevStep } = this.props.actions;
    prevStep();
  }

  nextStep = () => {

    const errorMessage = this.validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return false;
    }

    const { sell } = this.props;
    if (sell.step < steps.length-1) {
      const { nextStep } = this.props.actions;
      nextStep();
    } else {
      this.submit();
    }
  }

  validateForm = () => {
    let errorMessage = '';

    const { sell } = this.props;

    if (sell.step === 0) {
      errorMessage = this.validateFormStep0();
    } else if (sell.step === 2) {
      errorMessage = this.validateFormStep2();
    } else if (sell.step === 3) {
      errorMessage = this.validateFormStep3();
    }

    return errorMessage;
  }

  checkRequiredField = (step) => {
    let errorMessage = '';

    const { sell } = this.props;
    _.forEach(sell[step].requiredField, (value, key) => {
      if (sell.step0[value] === '') {
        errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      }
    });

    return errorMessage;
  }

  prevStep = () => {
    const { prevStep } = this.props.actions;
    prevStep();
  }

  nextStep = () => {

    let errorMessage = this.validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return false;
    }

    const { sell } = this.props;
    if (sell.step < steps.length - 1) {
      const { nextStep } = this.props.actions;
      nextStep();
    } else {
      this.submit();
    }
  }

  validateForm = () => {
    let errorMessage = '';

    const { sell } = this.props;

    if (sell.step === 0) {
      errorMessage = this.validateFormStep0();
    } else if (sell.step === 2) {
      errorMessage = this.validateFormStep2();
    } else if (sell.step === 3) {
      errorMessage = this.validateFormStep3();
    }

    return errorMessage;
  }

  checkRequiredField = (step) => {
    let errorMessage = '';

    const { sell } = this.props;
    _.forEach(sell[step].requiredField, (value, key) => {
      if (sell.step0[value] === '') {
        errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      }
    });

    return errorMessage;
  }

  isInt = (n) => {
    return n % 1 === 0;
  }

  validateFormStep0 = () => {
    let errorMessage = this.checkRequiredField('step0');
    if (errorMessage) {

      const { sell } = this.props;

      if (sell.step0.areaSize !== '') {
        if (!this.isInt(sell.step0.areaSize)) {
          errorMessage = '"พื้นที่ใช้สอย" ต้องกรอกเป็นตัวเลขเท่านั้น';
        }
      }

      if (sell.step0.landSize !== '') {
        if (!this.isInt(sell.step0.landSize)) {
          errorMessage = '"จำนวนที่ดิน" ต้องกรอกเป็นตัวเลขเท่านั้น';
        }
      }

      if (sell.step0.price !== '') {
        if (!this.isInt(sell.step0.price)) {
          errorMessage = '"ราคา" ต้องกรอกเป็นตัวเลขเท่านั้น';
        }
      }

      if (sell.step0.fee !== '') {
        if (!this.isInt(sell.step0.fee)) {
          errorMessage = '"ค่าธรรมเนียม" ต้องกรอกเป็นตัวเลขเท่านั้น';
        }
      }

      if (sell.step0.zipcode !== '') {
        const zipcodeRegExp = /^\d{5}$/;
        if (!zipcodeRegExp.test(sell.step0.zipcode)) {
          errorMessage = '"รหัสไปรษณีย์" ไม่ถูกต้อง';
        }
      }

    }
    return errorMessage;
  }

  validateFormStep2 = () => {
    let errorMessage = '';

    const { sell } = this.props;

    if (Object.keys(sell.step2.mainImage).length === 0) {
      errorMessage = 'กรุณาอัพโหลดรูปภาพหลัก';
    }

    return errorMessage;
  }

  validateFormStep3 = () => {
    let errorMessage = '';

    const { sell } = this.props;

    if (sell.step3.acceptTerms === false) {
      errorMessage = 'กรุณายอมรับข้อตกลงและเงื่อนไข';
    }

    return errorMessage;
  }

  submit = () => {
    const { sell, user } = this.props;
    const { doCreateRealEstate } = this.props.actions;
    if (sell.sendingData === false) {
      doCreateRealEstate(sell, user);
    }
  }

  success = () => {
    const { history } = this.props;
    const { sendDataSuccess } = this.props.actions;
    sendDataSuccess(false);
    this.openNotificationWithIcon('success', 'ประกาศขาย - เช่า สำเร็จ', 'ทางเราจะทำการตรวจสอบข้อมูลของท่านก่อนนำขึ้นเว็บไซต์จริง');
    history.push({
      pathname: '/',
    });
  }

  render() {
    const { sell } = this.props;
    const { step, sendingData, sendData } = sell;

    if (sendData === true) {
      this.success();
    }

    let renderStep = null;
    switch (step) {
      case 0:
        renderStep = <Step0 />;
        break;
      case 1:
        renderStep = <Step1 />;
        break;
      case 2:
        renderStep = <Step2 />;
        break;
      case 3:
        renderStep = <Step3 />;
        break;
      default:
    }

    let buttonAction = null;
    if (step === 0) {
      buttonAction = (
        <div className="row">
          <center>
            <button type="button" className="btn btn-primary" onClick={this.nextStep}>ต่อไป</button>
          </center>
        </div>
      );
    } else {
      buttonAction = (
        <div className="row">
          <div className="col-md-6 text-right">
            <button type="button" className="btn btn-default" onClick={this.prevStep}>ย้อนกลับ</button>
          </div>
          <div className="col-md-6">
            <button type="button" className="btn btn-primary" onClick={this.nextStep}>ต่อไป</button>
          </div>
        </div>);
    }

    return (
      <div id="Sell">
        <Spin tip="Loading..." spinning={sendingData}>
          <div className="container">
            <div className="row">
              <div className="col-md-10 col-md-offset-1">
                <div className="steps">
                  <Steps current={step}>
                    { steps.map(item => <Step key={item.title} title={item.title} />) }
                  </Steps>
                </div>
              </div>
            </div>
          </div>
          <hr />
          {renderStep}
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <div className="action">
                  {buttonAction}
                </div>
              </div>
            </div>
          </div>
        </Spin>
        <DevTool />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
    sell: state.sell,
  };
};

const actions = {
  fetchUserProfile: UserActions.fetchUserProfile,
  nextStep: SellActions.nextStep,
  prevStep: SellActions.prevStep,
  doCreateRealEstate: SellActions.doCreateRealEstate,
  sendDataSuccess: SellActions.sendDataSuccess,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sell);

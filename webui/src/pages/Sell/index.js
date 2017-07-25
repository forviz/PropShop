import React, { Component } from 'react';
import T from 'prop-types';
import { Steps, Spin, notification, Form } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import * as SellActions from '../../actions/sell-actions';

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
    firebase: T.shape().isRequired,
    history: T.shape().isRequired,
    actions: T.shape().isRequired,
    sell: T.shape().isRequired,
    user: T.shape().isRequired,
    form: T.func.isRequired,
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
        history.push({ pathname: '/login', search: '?redirectFrom=sell' });
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

  nextStep = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { sell } = this.props;
        if (sell.step < steps.length - 1) {
          const { nextStep } = this.props.actions;
          nextStep();
        } else {
          this.submit();
        }
      }
    });
    // const errorMessage = this.validateForm();
    // if (errorMessage) {
    //   alert(errorMessage);
    //   return false;
    // }
    // return true;
  }

  // validateForm = () => {
  //   let errorMessage = '';

  //   const { sell } = this.props;

  //   if (sell.step === 0) {
  //     errorMessage = this.validateFormStep0();
  //   } else if (sell.step === 2) {
  //     errorMessage = this.validateFormStep2();
  //   } else if (sell.step === 3) {
  //     errorMessage = this.validateFormStep3();
  //   }

  //   return errorMessage;
  // }

  // checkRequiredField = (step) => {
  //   let errorMessage = '';

  //   const { sell } = this.props;
  //   _.forEach(sell[step].requiredField, (field) => {
  //     if (sell.step0[field] === '') {
  //       errorMessage = 'กรุณากรอกข้อมูลให้ครบถ้วน';
  //       return {
  //         field,
  //         errorMessage,
  //       };
  //     }
  //   });

  //   return errorMessage;
  // }

  // isInt = (n) => {
  //   return n % 1 === 0;
  // }

  // validateFormStep0 = () => {
  //   let errorMessage = this.checkRequiredField('step0');
  //   if (!errorMessage) {
  //     const { sell } = this.props;

  //     if (sell.step0.areaSize !== '') {
  //       if (!this.isInt(sell.step0.areaSize)) {
  //         errorMessage = '"พื้นที่ใช้สอย" ต้องกรอกเป็นตัวเลขเท่านั้น';
  //       }
  //     }

  //     if (sell.step0.landSize !== '') {
  //       if (!this.isInt(sell.step0.landSize)) {
  //         errorMessage = '"จำนวนที่ดิน" ต้องกรอกเป็นตัวเลขเท่านั้น';
  //       }
  //     }

  //     if (sell.step0.price !== '') {
  //       if (!this.isInt(sell.step0.price)) {
  //         errorMessage = '"ราคา" ต้องกรอกเป็นตัวเลขเท่านั้น';
  //       }
  //     }

  //     if (sell.step0.fee !== '') {
  //       if (!this.isInt(sell.step0.fee)) {
  //         errorMessage = '"ค่าธรรมเนียม" ต้องกรอกเป็นตัวเลขเท่านั้น';
  //       }
  //     }

  //     if (sell.step0.zipcode !== '') {
  //       const zipcodeRegExp = /^\d{5}$/;
  //       if (!zipcodeRegExp.test(sell.step0.zipcode)) {
  //         errorMessage = '"รหัสไปรษณีย์" ไม่ถูกต้อง';
  //       }
  //     }
  //   }
  //   return errorMessage;
  // }

  // validateFormStep2 = () => {
  //   let errorMessage = '';

  //   const { sell } = this.props;

  //   if (Object.keys(sell.step2.mainImage).length === 0) {
  //     errorMessage = 'กรุณาอัพโหลดรูปภาพหลัก';
  //   }

  //   return errorMessage;
  // }

  // validateFormStep3 = () => {
  //   let errorMessage = '';

  //   const { sell } = this.props;

  //   if (sell.step3.acceptTerms === false) {
  //     errorMessage = 'กรุณายอมรับข้อตกลงและเงื่อนไข';
  //   }

  //   return errorMessage;
  // }

  submit = () => {
    const { sell, user } = this.props;
    const { doCreateRealEstate } = this.props.actions;
    if (sell.sendingData === false) {
      doCreateRealEstate(sell, user.id);
    }
  }

  success = () => {
    this.openNotificationWithIcon('success', 'ประกาศขาย - เช่า สำเร็จ', 'ทางเราจะทำการตรวจสอบข้อมูลของท่านก่อนนำขึ้นเว็บไซต์จริง');
    // const { history } = this.props;
    // history.push({
    //   pathname: '/',
    // });
    const { clearForm } = this.props.actions;
    clearForm();
  }

  fail = () => {
    this.openNotificationWithIcon('error', 'ประกาศขาย - เช่า ล้มเหลว', 'เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลของท่านอีกครั้ง');
  }

  buttonAction = () => {
    const { step } = this.props.sell;
    if (step === 0) {
      return (
        <div className="row">
          <center>
            <button type="submit" className="btn btn-primary">ต่อไป</button>
          </center>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="col-md-6 text-right">
          <button type="button" className="btn btn-default" onClick={this.prevStep}>ย้อนกลับ</button>
        </div>
        <div className="col-md-6">
          <button type="submit" className="btn btn-primary">ต่อไป</button>
        </div>
      </div>
    );
  }

  renderStep = () => {
    const { form } = this.props;
    const { step } = this.props.sell;
    switch (step) {
      case 0:
        return <Step0 form={form} />;
      case 1:
        return <Step1 form={form} />;
      case 2:
        return <Step2 form={form} />;
      case 3:
        return <Step3 form={form} />;
      default:
        return <Step0 form={form} />;
    }
  }

  render() {
    const { sell } = this.props;
    const { step, sendingData, sendDataSuccess } = sell;

    if (sendDataSuccess === 'yes') {
      this.success();
    } else if (sendDataSuccess === 'no') {
      this.fail();
    }

    return (
      <div id="Sell">
        <Form onSubmit={this.nextStep}>
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
            {this.renderStep()}
            <div className="container">
              <div className="row">
                <div className="col-md-6 col-md-offset-3">
                  <div className="action">
                    {this.buttonAction()}
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </Form>
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
  nextStep: SellActions.nextStep,
  prevStep: SellActions.prevStep,
  doCreateRealEstate: SellActions.doCreateRealEstate,
  clearForm: SellActions.clearForm,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

const SellForm = Form.create()(Sell);

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(SellForm);

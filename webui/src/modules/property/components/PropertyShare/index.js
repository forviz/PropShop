import React, { Component } from 'react';
// import T from 'prop-types';
import { Popover, Modal, Form, Input, Alert, Spin } from 'antd';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import {
  ShareButtons,
} from 'react-share';
import _ from 'lodash';

import { propertyShare } from '../../api';

const FormItem = Form.Item;

const {
  FacebookShareButton,
  // GooglePlusShareButton,
  // LinkedinShareButton,
  // TwitterShareButton,
  // TelegramShareButton,
  // WhatsappShareButton,
  // PinterestShareButton,
  // VKShareButton,
  // OKShareButton,
  // RedditShareButton,
} = ShareButtons;

const EmailShareForm = Form.create()(
  (props) => {
    const { visible, onCancel, onConfirm, form, resultStatus, resultMessage, user, sending } = props;
    const { getFieldDecorator } = form;

    let name = '';
    if (_.get(user, 'name')) {
      name = `${_.get(user, 'name')} ${_.get(user, 'lastname')}`;
    } else {
      name = _.get(user, 'spyrocash');
    }

    const email = _.get(user, 'email');

    return (
      <span>
        {resultStatus && resultMessage ? (
          <Modal
            visible={visible}
            title="แชร์โครงการนี้ให้เพื่อนของคุณ!"
            onCancel={onCancel}
            footer={null}
          >
            <Alert message={resultMessage} type={resultStatus} showIcon />
          </Modal>
        ) : (
          <Modal
            visible={visible}
            title="แชร์โครงการนี้ให้เพื่อนของคุณ!"
            okText="ยืนยัน"
            cancelText="ยกเลิก"
            onCancel={onCancel}
            onOk={onConfirm}
            confirmLoading={sending}
          >
            <Form layout="horizontal">
              <FormItem
                label="ชื่อ"
                colon={false}
              >
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [{ required: true, message: 'กรุณากรอกชื่อของคุณ!' }],
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem
                label="อีเมล"
                colon={false}
              >
                {getFieldDecorator('email', {
                  initialValue: email,
                  rules: [{
                    type: 'email', message: 'อีเมลไม่ถูกต้อง!',
                  }, {
                    required: true, message: 'กรุณากรอกอีเมลของคุณ!',
                  }],
                })(
                  <Input />,
                )}
              </FormItem>
              <FormItem
                label="อีเมลเพื่อนคุณ"
                colon={false}
                extra="สามารถใส่ได้หลายอีเมล โดยใช้ , คั่น"
              >
                {getFieldDecorator('sendTo', {
                  rules: [{ required: true, message: 'กรุณากรอกอีเมลเพื่อนของคุณ!' }],
                })(
                  <Input />,
                )}
              </FormItem>
            </Form>
          </Modal>
        )}
      </span>
    );
  },
);

class PropertyShare extends Component {

  static propTypes = {

  }

  static defaultProps = {
    isClicked: false,
  }

  state = {
    showPopover: false,
    showEmailModal: false,
    resultStatus: '',
    resultMessage: '',
    sending: false,
  }

  handleShareEmail = () => {
    this.setState({
      showEmailModal: true,
      showPopover: false,
    });
  }

  handleShareFacebook = () => {
    this.setState({
      showPopover: false,
    });
  }

  handlePopoverChange = (showPopover) => {
    this.setState({ showPopover });
  }

  content = () => {
    const { item } = this.props;
    return (
      <ul className="share-list">
        <li>
          <FontAwesome name="envelope-o" onClick={this.handleShareEmail} />
        </li>
        <li>
          <FacebookShareButton
            url={window.location.href}
            quote={item.project}
            onClick={this.handleShareFacebook}
            style={{ outline: 0 }}
          >
            <FontAwesome name="facebook-official" />
          </FacebookShareButton>
        </li>
      </ul>
    );
  }

  handleCancelEmailModal = () => {
    this.setState({
      showEmailModal: false,
    });
    const form = this.form;
    form.resetFields();
    this.setState({
      showPopover: false,
      showEmailModal: false,
      resultStatus: '',
      resultMessage: '',
      sending: false,
    });
  }

  saveEmailShareForm = (form) => {
    this.form = form;
  }

  handleConfirmEmailModal = () => {
    const _self = this;
    const { item } = this.props;
    const form = this.form;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      _self.setState({
        sending: true,
      });
      const name = values.name;
      const email = values.email;
      const sendTo = values.sendTo;
      const project = item.project;
      const propertyUrl = `${process.env.REACT_APP_BASE_URL}/#/property/${item.id}`;
      const shareResult = await propertyShare(name, email, sendTo, project, propertyUrl);
      _self.setState({
        resultStatus: shareResult.status === 'success' ? 'success' : 'error',
        resultMessage: shareResult.status === 'success' ? 'แชร์โครงการนี้ให้เพื่อนสำเร็จ' : 'เกิดข้อผิดพลาด ข้อมูลไม่ถูกต้อง',
        sending: false,
      });
      form.resetFields();
    });
  }

  handleShare = () => {
    if (this.props.onChange) {
      this.props.onChange(true);
    }
    this.setState({
      showPopover: true,
    });
  }

  render() {
    const { user, isClicked } = this.props;

    if (isClicked) {
      this.handleShare();
    }

    const { showEmailModal, showPopover, resultStatus, resultMessage, sending } = this.state;
    return (
      <span className="PropertyShare">
        <Popover
          content={this.content()}
          trigger="click"
          placement="bottom"
          visible={showPopover}
          onVisibleChange={this.handlePopoverChange}
        >
          <FontAwesome name="envelope-o" />
        </Popover>
        {showEmailModal &&
          <EmailShareForm
            ref={this.saveEmailShareForm}
            visible={showEmailModal}
            onCancel={this.handleCancelEmailModal}
            onConfirm={this.handleConfirmEmailModal}
            resultStatus={resultStatus}
            resultMessage={resultMessage}
            user={user}
            sending={sending}
          />
        }
      </span>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

const actions = {

};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(PropertyShare);

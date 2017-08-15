import React, { Component } from 'react';
import T from 'prop-types';
import { Form, Input, Button, Spin, Alert } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as Actions from '../../actions';

const FormItem = Form.Item;

class AgentContact extends Component {

  static propTypes = {
    actions: T.shape().isRequired,
    form: T.shape().isRequired,
    agentId: T.string.isRequired,
    agentName: T.string.isRequired,
    propertyId: T.string.isRequired,
    projectName: T.string.isRequired,
    emailTo: T.string.isRequired,
    domain: T.string.isRequired,
    submitting: T.bool.isRequired,
    sendSuccess: T.string.isRequired,
    user: T.shape({
      username: T.string,
      email: T.string,
      phone: T.string,
    }),
  }

  constructor(props) {
    super(props);
    this.setDomain();
  }

  setDomain = () => {
    const { domain } = this.props;
    const { initDomain } = this.props.actions;
    initDomain(domain);
  }

  getSendSuccessMessage = (sendSuccess) => {
    const option = {
      message: sendSuccess === 'yes' ? 'ส่งข้อความสำเร็จ' : 'ส่งข้อความล้มเหลว',
      type: sendSuccess === 'yes' ? 'success' : 'error',
    };
    return <Alert {...option} />;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { agentId, emailTo, domain, agentName, propertyId, projectName } = this.props;
        const name = _.get(values, 'name');
        const emailFrom = _.get(values, 'email');
        const mobile = _.get(values, 'mobile');
        const body = _.get(values, 'body');
        const { contactAgent } = this.props.actions;
        contactAgent(domain, name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyId, projectName);
      }
    });
  }

  render() {
    const { user, submitting, sendSuccess } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="AgentContact">
        <Spin tip="Loading..." spinning={submitting}>
          {sendSuccess !== '' ? (
            <center>
              {this.getSendSuccessMessage(sendSuccess)}
            </center>
          ) : (
            <Form onSubmit={this.handleSubmit} className="contact-form">
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: user.username,
                  rules: [{ required: false, message: '' }],
                })(
                  <Input placeholder="ชื่อ" />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('email', {
                  initialValue: user.email,
                  rules: [{
                    type: 'email', message: 'กรุณากรอกอีเมลให้ถูกต้อง!',
                  }, {
                    required: true, message: 'กรุณากรอกอีเมล!',
                  }],
                })(
                  <Input type="email" placeholder="อีเมล" />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('mobile', {
                  initialValue: user.phone,
                  rules: [{ required: false, message: '' }],
                })(
                  <Input placeholder="เบอร์โทรศัพท์" />,
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('body', {
                  rules: [{ required: true, message: 'กรุณากรอกข้อความ!' }],
                })(
                  <Input type="textarea" placeholder="ข้อความ" />,
                )}
              </FormItem>
              <FormItem>
                <Button type="danger" htmlType="submit" className="contact-form-button" style={{ width: '100%' }}>
                  ตกลง
                </Button>
              </FormItem>
            </Form>
          )}
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { domain } = props;
  return {
    user: state.user.data,
    submitting: _.get(state.entities.agents, `${domain}.contact.submitting`) ? _.get(state.entities.agents, `${domain}.contact.submitting`) : false,
    sendSuccess: _.get(state.entities.agents, `${domain}.contact.sendSuccess`) ? _.get(state.entities.agents, `${domain}.contact.sendSuccess`) : '',
  };
};

const actions = {
  initDomain: Actions.initDomain,
  contactAgent: Actions.contactAgent,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

const AgentContactForm = Form.create()(AgentContact);

export default connect(mapStateToProps, mapDispatchToProps)(AgentContactForm);

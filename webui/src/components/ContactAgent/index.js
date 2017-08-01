import React, { Component } from 'react';
import T from 'prop-types';
import { Form, Input, Button } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as agentAPI from '../../api/agent';

const FormItem = Form.Item;

class ContactAgent extends Component {

  static propTypes = {
    form: T.shape().isRequired,
    agentId: T.string.isRequired,
    emailTo: T.string.isRequired,
    user: T.shape({
      username: T.string,
      email: T.string,
      phone: T.string,
    }),
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { agentId, emailTo } = this.props;
        const name = _.get(values, 'name');
        const emailFrom = _.get(values, 'email');
        const mobile = _.get(values, 'mobile');
        const body = _.get(values, 'body');
        agentAPI.contactAgent(name, emailFrom, emailTo, mobile, body, agentId);
      }
    });
  }

  render() {
    const { user } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="ContactAgent">
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

const actions = {};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

const ContactAgentForm = Form.create()(ContactAgent);

export default connect(mapStateToProps, mapDispatchToProps)(ContactAgentForm);

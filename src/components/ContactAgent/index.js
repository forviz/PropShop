import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { contactAgent } from '../../api/agent';

const actions = {
  sendContact: (name, email, mobile, body) => {
    return (dispatch) => {
      contactAgent(name, email, mobile, body)
      .then((response) => {
        console.log('sencContact', response);
        dispatch({ type: 'SEND/CONTACT/SUCCESS' });
      });
    };
  },
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(undefined, mapDispatchToProps)(
class ContactAgent extends Component {

  handleSubmit = () => {
    console.log('submit', this.contactName, this.contactEmail, this.contactMobile, this.body);
    this.props.actions.sendContact(this.contactName.value, this.contactEmail.value, this.contactMobile.value, this.body.value);
  }

  /* eslint-disable no-return-assign */
  render() {
    return (
      <div className="ContactAgent">
        <div className="form-group" style={{ marginBottom: 10 }}>
          <input type="text" ref={c => this.contactName = c} className="form-control" placeholder="ชื่อ" />
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <input type="email" ref={c => this.contactEmail = c} className="form-control" placeholder="อีเมล" />
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <input type="text" ref={c => this.contactMobile = c} className="form-control" placeholder="เบอร์โทรศัพท์" />
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <textarea ref={c => this.body = c} className="form-control" rows="3" placeholder="ข้อความ" />
        </div>
        <div className="form-group" style={{ marginBottom: 10 }}>
          <button type="button" className="btn btn-danger" style={{ width: '100%' }} onClick={this.handleSubmit}>ตกลง</button>
        </div>
      </div>
    );
  }
});

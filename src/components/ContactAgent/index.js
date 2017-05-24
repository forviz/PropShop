import React, { Component } from 'react';

class ContactAgent extends Component {

  render() {
    return (
      <div className="ContactAgent">
        <div className="form-group" style={{marginBottom: 10}}><input type="text" className="form-control" placeholder="ชื่อ" /></div>
        <div className="form-group" style={{marginBottom: 10}}><input type="email" className="form-control" placeholder="อีเมล" /></div>
        <div className="form-group" style={{marginBottom: 10}}><input type="text" className="form-control" placeholder="เบอร์โทรศัพท์" /></div>
        <div className="form-group" style={{marginBottom: 10}}><textarea className="form-control" rows="3" placeholder="ข้อความ"></textarea></div>
        <div className="form-group" style={{marginBottom: 10}}><button type="button" className="btn btn-danger" style={{width: '100%'}}>ตกลง</button></div>
      </div>
    );
      
  }
}

export default ContactAgent;
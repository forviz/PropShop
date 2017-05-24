import React, { Component } from 'react';
import { Radio } from 'antd';

const RadioGroup = Radio.Group;

class Step0 extends Component {

  render() {
    return (
      <div id="Step0">
        <div className="container">
      		<div className="row">
	        	<div className="col-md-6 col-md-offset-3">
	        		<h1>รายละเอียดทรัพย์สิน</h1>
	        		<div className="form">
	        			<div className="type">
	        				<RadioGroup defaultValue={1}>
						        <Radio value={1}>ประกาศขาย</Radio>
						        <Radio value={2}>ประกาศเช่า</Radio>
						        <Radio value={3}>เลือกทั้งคู่</Radio>
						      </RadioGroup>
	        			</div>
	        			<div className="input">
	        				<div className="row">
		        				<div className="col-md-3">
		        					<div className="form-group">
										    <label>ประเภทที่อยู่อาศัย</label>
										    <select className="form-control">
												  <option value="condo">Condo</option>
		                      <option value="house">House</option>
												</select>
										  </div>
		        				</div>
		        				<div className="col-md-9">
		        					<div className="form-group">
										    <label>ชื่อโครงการ, ชื่อแบรนด์</label>
										    <input type="text" className="form-control" />
										  </div>
		        				</div>
		        			</div>
		        			<div className="row">
		        				<div className="col-md-3">
		        					<div className="form-group">
										    <label>หมายเลขห้อง</label>
										    <input type="text" className="form-control" />
										  </div>
		        				</div>
		        				<div className="col-md-3">
		        					<div className="form-group">
										    <label>ชั้น</label>
										    <input type="text" className="form-control" />
										  </div>
		        				</div>
		        				<div className="col-md-3">
		        					<div className="form-group">
										    <label>จำนวนห้องนอน</label>
										    <select className="form-control">
												  <option value="1">1</option>
		                      <option value="2">2</option>
												</select>
										  </div>
		        				</div>
		        				<div className="col-md-3">
		        					<div className="form-group">
										    <label>จำนวนห้องน้ำ</label>
										    <select className="form-control">
												  <option value="1">1</option>
		                      <option value="2">2</option>
												</select>
										  </div>
		        				</div>
		        			</div>
		        			<div className="row">
		        				<div className="col-md-6">
		        					<div className="form-group">
										    <label>ขนาด(ตร.ม.)</label>
										    <input type="text" className="form-control" />
										  </div>
		        				</div>
		        				<div className="col-md-6">
		        					<div className="form-group">
										    <label>ราคา(บาท)</label>
										    <input type="text" className="form-control" />
										  </div>
		        				</div>
		        			</div>
	        			</div>
	        		</div>
	        	</div>
	        </div>
      	</div>
      </div>
    );
  }
}

export default Step0;
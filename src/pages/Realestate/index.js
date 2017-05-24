import React, { Component } from 'react';
import numeral from 'numeral';
import { Rate } from 'antd';
import _ from 'lodash';

import ContactAgent from '../../components/ContactAgent';
import realEstateData from '../../../public/data/realEstateData.json';
import agentData from '../../../public/data/agentData.json';
import advertising1 from '../../images/advertising/1.jpg';

class Realestate extends Component {

	state = {

	}

  render() {

    const { match } = this.props;

    const id = parseInt(match.params.id, 10);
    const item = _.find(realEstateData, ['id', id]);
    const agent = _.find(agentData, ['id', item.agentId]);

    const imageBackground = {
      background: `url(${item.mainImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }

    return (
      <div id="Realestate">
        <div className="action">
          <div className="container">
            <div className="row">
              <div className="col-md-12">

              </div>
            </div>
          </div>
        </div>
        <hr/>
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="cover">
                  <div className="image" style={imageBackground}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="contact_agent">
                          <div className="price">{numeral(item.price).format('0,0')} <span>บาท</span></div>
                          <div className="detail">
                            <div className="row">
                              <div className="col-md-5">
                                <img src={agent.image} alt={agent.name} />
                              </div>
                              <div className="col-md-7" style={{paddingLeft: 0}}>
                                <div className="name">{agent.name}</div>
                                <div className="rating">
                                  <Rate disabled defaultValue={agent.rate.rating} />
                                  <span>({agent.rate.count})</span>
                                </div>
                                <div className="phone">{agent.phone}</div>
                              </div>
                            </div>
                          </div>
                          <div className="form">
                            <ContactAgent />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="open_house">เปิดบ้าน</div>
                      </div>
                    </div>
                  </div>
                  <div className="address">
                    <div className="row">
                      <div className="col-md-4 vcenter"></div>
                      <div className="col-md-5 vcenter">
                        <div className="sell_by">เจ้าของขายเอง</div>
                        <div className="address_1">{item.address.address} ซอยอนามัย ถนนศรีนครินทร์</div>
                        <div className="address_2">สวนหลวง กรุงเทพฯ 10250 (ซอยอนามัย)</div>
                        <div className="options">
                          <ul>
                            <li>{item.room.bedroom} ห้องนอน</li>
                            <li>{item.room.bathroom} ห้องน้ำ</li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-3 vbottom">
                        <div className="create_date">อยู่ในพรอพช็อปมาแล้ว 3 วัน</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-9">
                    <div className="description">
                      <section>
                        <h2>รายละเอียดของ <span>5/90</span></h2>
                        <div>{item.detail}</div>
                        <h4>เปิดบ้าน</h4>
                        <div className="row">
                          <div className="col-md-6">เสาร์ที่ 1 เมษายน</div>
                          <div className="col-md-6">13.00 น. - 18.00 น.</div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">เสาร์ที่ 1 เมษายน</div>
                          <div className="col-md-6">13.00 น. - 18.00 น.</div>
                        </div>
                      </section>
                      <section>
                        <h2>คุณสมบัติต่างๆ</h2>
                        <div>ข้อมูลปรับปรุงล่าสุดเมื่อวันที่ 29/3/2017 12:00 AM:</div>
                        <div className="row">
                          <div className="col-md-4">
                            <div>ราคา: {numeral(item.price).format('0,0')} บาท</div>
                            <div>2 ห้องนอน</div>
                            <div>2 ห้องน้ำ</div>
                            <div>ห้องครัว built in</div>
                          </div>
                          <div className="col-md-4">
                            <div>สถานะ: สำหรับขาย</div>
                            <div>โรงรถ</div>
                            <div>ย่าน: <span className="text-gray">ซอยอนามัย</span></div>
                          </div>
                          <div className="col-md-4">
                            <div>พื้นที่ใช้สอย: 40 ตร.ว.</div>
                            <div>รหัสไปรษณีย์: 10250</div>
                          </div>
                        </div>
                        <div>
                          <h4>ค่าธรรมเนียมและภาษี</h4>
                          <div className="text-gray">ประมาณ 15000 บาท</div>
                        </div>
                      </section>
                      <section>
                        <h2>ความสามารถในการจ่ายได้</h2>
                        <h4>คำนวณจำนวนเงินผ่อนของคุณสำหรับ <span className="text-gray">5/90</span></h4>
                        <div>การชำระเงินโดยประมาณ: 17553 บาท / เดือน</div>
                        <div className="row calculate">
                          <div className="col-md-3">
                            <label>ราคาของทรัพย์สิน</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="col-md-3">
                            <label>ชำระเงินดาวน์</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="col-md-3">
                            <label>อัตราดอกเบี้ย</label>
                            <input type="text" className="form-control" />
                          </div>
                          <div className="col-md-3">
                            <label>ประเภทเงินกู้</label>
                            <input type="text" className="form-control" />
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <img src={advertising1} alt="advertising" />
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

export default Realestate;
import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import numeral from 'numeral';
import { Rate } from 'antd';
import _ from 'lodash';

import NearbyPlace from '../../containers/NearbyPlace';
import ButtonAction from '../../components/ButtonAction';
import ContactAgent from '../../components/ContactAgent';
import realEstateData from '../../../public/data/realEstateData.json';
import agentData from '../../../public/data/agentData.json';
import advertising1 from '../../images/advertising/1.jpg';

class Realestate extends Component {

	state = {

	}

  handleWishLish = () => {

  }

  handleShare = () => {

  }

  backToHome = () => {
    const { history } = this.props;
    history.push({
      pathname: '/',
    });
  }

  render() {

    const { match } = this.props;

    const id = parseInt(match.params.id, 10);
    const item = _.find(realEstateData, ['id', id]);
    const agent = _.find(agentData, ['id', item.agentId]);

    console.log('item', item);

    const images = _.map(item.images, (image) => {
      return {
        original: image,
        thumbnail: image,
      }
    });

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
                <div className="clearfix" style={{ margin: '30px 0' }} >
                  <div className="pull-left">
                    <div>
                      <div className="backhome" onClick={this.backToHome} >
                        <FontAwesome name="angle-left" /> กลับไปที่ค้นหา
                      </div>
                      <div className="address">
                        <b>สำหรับขาย > กรุงเทพฯ > สวนหลวง > ซอยอนามัย > </b> <span className="text-gray">5/90 ซอยอนามัย ถนนศรีนครินทร์</span>
                      </div>
                    </div>
                  </div>
                  <div className="pull-right">
                    <div style={{ display: 'inline-block', marginRight: 8 }} >
                      <ButtonAction font="heart-o" text="บันทึก" onClick={this.handleWishLish} />
                    </div>
                    <div style={{ display: 'inline-block' }} >
                      <ButtonAction font="envelope-o" text="แบ่งปัน" onClick={this.handleShare} />
                    </div>
                  </div>
                </div>
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
                  <ImageGallery
                    items={images}
                    slideInterval={2000}
                    showPlayButton={false}
                  />
                  <div className="google-map">
                    <div className="map-view">

                    </div>
                    <div className="street-view">

                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="detail-block">
                  <div className="row">
                    <div className="col-md-8" style={{ paddingRight: 0 }} >
                      <div className="row">
                        <div className="col-md-12">
                          <div className="main-info">
                            <div className="row">
                              <div className="col-md-5">
                                <div className="price-block">
                                  <div className="for">ขายหลังโอนกรรมสิทธิ์</div>
                                  <div className="price">฿5,000,000</div>
                                  <div className="create_date">อยู่ในพรอพช็อปมาแล้ว 3 วัน</div>
                                </div>
                              </div>
                              <div className="col-md-7">
                                <div className="address-block">
                                  <div className="address_1">5/90 บ้านกลางเมือง</div>
                                  <div className="address_2">ซอยอนามัย ถนนศรีนครินทร์ เขตสวนหลัง กรุงเทพฯ 10250</div>
                                  <div className="options">
                                    <ul>
                                      <li><FontAwesome name="bed" /> {item.room.bedroom} ห้องนอน</li>
                                      <li><FontAwesome name="bath" /> {item.room.bathroom} ห้องน้ำ</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <section className="info detail">
                            <h2>รายละเอียด</h2>
                            <div className="announcementDetails">
                              {item.detail}
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4" style={{ paddingLeft: 0 }} >
                      <div className="contact-block">
                        <div className="agent-block">
                          <div className="row">
                            <div className="col-md-4 vcenter">
                              <div className="agent-image">
                                <img src={agent.image} alt={agent.name} />
                              </div>
                            </div>
                            <div className="col-md-8 vcenter">
                              <div className="agent-info">
                                <div className="name">{agent.name}</div>
                                <div className="rating">
                                  <Rate disabled defaultValue={agent.rate.rating} />
                                  <span>({agent.rate.count})</span>
                                </div>
                                <div className="phone">{agent.phone}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ContactAgent />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <section className="info features">
                  <h2>คุณสมบัติต่างๆ</h2>
                  <div>ข้อมูลปรับปรุงล่าสุดเมื่อวันที่ 29/3/2017 12:00 AM:</div>
                  <div className="row">
                    <div className="col-md-3">ราคา: 5,000,000 บาท</div>
                    <div className="col-md-3">สถานะ: สำหรับขาย</div>
                    <div className="col-md-3">พื้นที่ใช้สอย: 40 ตร.ว.</div>
                    <div className="col-md-3">ย่าน: ซอยอนามัย</div>
                    <div className="col-md-3">2 ห้องนอน</div>
                    <div className="col-md-3">2 ห้องน้ำ</div>
                    <div className="col-md-3">ที่จอดรถส่วนตัว</div>
                    <div className="col-md-3">ห้องครัว built in</div>
                  </div>
                  <div className="facilities-block">
                    <h4>สิ่งอำนวยความสะดวก:</h4>
                    <div className="row">
                      <div className="col-md-3">ราคา: 5,000,000 บาท</div>
                      <div className="col-md-3">ราคา: 5,000,000 บาท</div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fee-block">
                        <h4>ค่าธรรมเนียมและภาษี:</h4>
                        <div className="text-gray">ประมาณ 15,000 บาท</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            <div className="nearby_place">
              <NearbyPlace />
            </div>
            <div className="row">
              <div className="col-md-12">
                <section className="info calculate">
                  <h2>ความสามารถในการจ่ายได้</h2>
                  <h4>คำนวณจำนวนเงินผ่อนของคุณ</h4>
                  <div>การชำระเงินโดยประมาณ: 17,553 บาท / เดือน</div>
                  <div className="calculate-block">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="text">ราคาของทรัพย์สิน</div>
                        <div>
                          <div className="input-group">
                            <input type="text" className="form-control" value="5,000,000" />
                            <div className="input-group-addon">บาท</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text">ชำระเงินดาวน์</div>
                        <div>
                          <div className="input-group">
                            <div className="input-group-addon">20 %</div>
                            <input type="text" className="form-control" value="1,000,000" />
                            <div className="input-group-addon">บาท</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text">อัตราดอกเบี้ย</div>
                        <div>
                          <div className="input-group">
                            <input type="text" className="form-control" value="3.9" />
                            <div className="input-group-addon">%</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="text">ประเภทเงินกู้</div>
                        <div>
                          <select className="form-control">
                            <option>30 ปีคงที่</option>
                            <option>40 ปีคงที่</option>
                            <option>50 ปีคงที่</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="graph">

                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="cal-summary">
                        <h4>ยอดเงินผ่อนต่อเดือน</h4>
                        <div className="clearfix">
                          <div className="pull-left">เงินต้นและดอกเบี้ย</div>
                          <div className="pull-right">(14,561 บาท)</div>
                        </div>
                        <div className="clearfix">
                          <div className="pull-left">เงินต้นและดอกเบี้ย</div>
                          <div className="pull-right">(14,561 บาท)</div>
                        </div>
                        <div className="clearfix">
                          <div className="pull-left">เงินต้นและดอกเบี้ย</div>
                          <div className="pull-right">(14,561 บาท)</div>
                        </div>
                        <div className="clearfix">
                          <div className="pull-left">เงินต้นและดอกเบี้ย</div>
                          <div className="pull-right">(14,561 บาท)</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="advertising"></div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Realestate;
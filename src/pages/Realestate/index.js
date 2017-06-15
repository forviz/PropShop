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
          </div>
        </div>

        
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
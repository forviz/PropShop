import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import ImageGallery from 'react-image-gallery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import numeral from 'numeral';
// import { Rate } from 'antd';
import _ from 'lodash';

// import NearbyPlace from '../../containers/NearbyPlace';
import ButtonAction from '../../components/ButtonAction';
import ContactAgent from '../../components/ContactAgent';
import MapComponent from '../../components/Map/MapWithStreetView';
import NearbyPlace from '../../components/Map/MapNearbyPlace';
// import realEstateData from '../../../public/data/realEstateData.json';
// import agentData from '../../../public/data/agentData.json';
// import advertising1 from '../../images/advertising/1.jpg';

import * as RealestateActions from '../../actions/realestate-actions';

import * as contentful from '../../api/contentful';

class Realestate extends Component {

  constructor(props) {
    super(props);
    const { match } = this.props;
    const id = match.params.id;
    this.getRealestates(id);
  }

  state = {
    showStreetView: false,
  }

  componentDidMount() {

  }

  getRealestates = (id) => {
    const { fetchRealestates } = this.props.actions;
    fetchRealestates({
      id,
    });
  }

  getAgent = (id) => {
    return contentful.getAgent(id).then((agent) => {
      return agent;
    });
  }

  handleWishList = () => {

  }

  handleShare = () => {

  }

  backToHome = () => {
    const { history } = this.props;
    history.push({
      pathname: '/',
    });
  }

  handleStreerView = () => {
    this.setState({
      showStreetView: !this.state.showStreetView,
    });
  }

  render() {
    let { data } = this.props;

    if (_.size(data) === 0) return <div />;

    data = data[0];

    let images = [];
    images.push({
      original: data.mainImage,
      thumbnail: data.mainImage,
    });

    if (data.images) {
      images = _.map(data.images, (image) => {
        return {
          original: image,
          thumbnail: image,
        };
      });
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
                      <div role="button" tabIndex={0} className="backhome" onClick={this.backToHome} >
                        <FontAwesome name="angle-left" /> กลับไปที่ค้นหา
                      </div>
                      <div className="address">
                        <b>สำหรับ{data.for} {'>'} {data.province} {'>'} {data.amphur} {'>'} {data.district} {'>'} </b>
                        <span className="text-gray">{data.address} ถนน{data.street}</span>
                      </div>
                    </div>
                  </div>
                  {/*
                  <div className="pull-right">
                    <div style={{ display: 'inline-block', marginRight: 8 }} >
                      <ButtonAction font="heart-o" text="บันทึก" onClick={this.handleWishList} />
                    </div>
                    <div style={{ display: 'inline-block' }} >
                      <ButtonAction font="envelope-o" text="แบ่งปัน" onClick={this.handleShare} />
                    </div>
                  </div>
                  */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
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
                    <div className="clearfix">
                      <div className="pull-left text-center">
                        <div role="button" tabIndex={0} onClick={this.handleStreerView}>
                          <img src={`${process.env.PUBLIC_URL} /images/googlemap/map-mark.jpg`} alt="Map View" />
                        </div>
                        <div>Map View</div>
                      </div>
                      <div className="pull-right text-center">
                        <div role="button" tabIndex={0} onClick={this.handleStreerView}>
                          <img src={`${process.env.PUBLIC_URL} /images/googlemap/map-street.jpg`} alt="Street View" />
                        </div>
                        <div>Street View</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {this.state.showStreetView === true &&
              <div className="row">
                <div className="col-md-12">
                  <div className="street-view">
                    <MapComponent center={{ lat: data.location.lat, lng: data.location.lon }} />
                  </div>
                </div>
              </div>
            }
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
                                  <div className="for">{data.for}</div>
                                  <div className="price">฿{numeral(data.price).format('0,0')}</div>
                                  <div className="create_date">อยู่ในพรอพช็อปมาแล้ว {data.inWebsite} วัน</div>
                                </div>
                              </div>
                              <div className="col-md-7">
                                <div className="address-block">
                                  <div className="address_1">{data.address}</div>
                                  <div className="address_2">ถนน{data.street} เขต{data.amphur} {data.province} {data.zipcode}</div>
                                  <div className="options">
                                    <ul>
                                      <li><FontAwesome name="bed" /> {data.bedroom} ห้องนอน</li>
                                      <li><FontAwesome name="bath" /> {data.bathroom} ห้องน้ำ</li>
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
                              {data.announcementDetails &&
                                <div>
                                  {data.announcementDetails.split('\n').map((item, key) => {
                                    return <span key={key.toString()}>{item}<br /></span>;
                                  })}
                                </div>
                              }
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                    {data.agent &&
                      <div className="col-md-4" style={{ paddingLeft: 0 }} >
                        <div className="contact-block">
                          <div className="agent-block">
                            <div className="row">
                              <div className="col-md-4 vcenter">
                                <div className="agent-image">
                                  <img src={data.agent.image.fields.file.url} alt={`${data.agent.name} ${data.agent.lastname}`} />
                                </div>
                              </div>
                              <div className="col-md-8 vcenter">
                                <div className="agent-info">
                                  <div className="name">{data.agent.name} {data.agent.lastname}</div>
                                  {/*
                                  <div className="rating">
                                    <Rate disabled defaultValue={data.agent.rate.rating} />
                                    <span>({agent.rate.count})</span>
                                  </div>
                                  */}
                                  <div className="phone">{data.agent.phone}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <ContactAgent />
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <section className="info features">
                  <h2>คุณสมบัติต่างๆ</h2>
                  <div>ข้อมูลปรับปรุงล่าสุดเมื่อวันที่ {data.lastUpdate}:</div>
                  <div className="row">
                    <div className="col-md-3">ราคา: {numeral(data.price).format('0,0')} บาท</div>
                    <div className="col-md-3">สถานะ: สำหรับ{data.for}</div>
                    <div className="col-md-3">พื้นที่ใช้สอย: {data.areaSize} ตร.ว.</div>
                    <div className="col-md-3">{data.bedroom} ห้องนอน</div>
                    <div className="col-md-3">{data.bathroom} ห้องน้ำ</div>
                  </div>
                  <div className="facilities-block">
                    <h4>สิ่งอำนวยความสะดวก:</h4>
                    <div className="row">
                      {data.specialFeatureView &&
                        <span>
                          {
                            _.map(data.specialFeatureView, (value) => {
                              return <div className="col-md-3">{value}</div>;
                            })
                          }
                        </span>
                      }
                      {data.specialFeatureFacilities &&
                        <span>
                          {
                            _.map(data.specialFeatureFacilities, (value) => {
                              return <div className="col-md-3">{value}</div>;
                            })
                          }
                        </span>
                      }
                      {data.specialFeatureNearbyPlaces &&
                        <span>
                          {
                            _.map(data.specialFeatureNearbyPlaces, (value) => {
                              return <div className="col-md-3">{value}</div>;
                            })
                          }
                        </span>
                      }
                      {data.specialFeaturePrivate &&
                        <span>
                          {
                            _.map(data.specialFeaturePrivate, (value) => {
                              return <div className="col-md-3">{value}</div>;
                            })
                          }
                        </span>
                      }
                    </div>
                  </div>
                  {data.fee &&
                    <div className="row">
                      <div className="col-md-12">
                        <div className="fee-block">
                          <h4>ค่าธรรมเนียมและภาษี:</h4>
                          <div className="text-gray">ประมาณ {numeral(data.fee).format('0,0')} บาท</div>
                        </div>
                      </div>
                    </div>
                  }
                </section>
              </div>
            </div>
            <div className="nearby_place">
              <NearbyPlace />
            </div>
            {/*
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
            */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.realestates.data,
    loading: state.realestates.loading,
  };
};

const actions = {
  fetchRealestates: RealestateActions.fetchRealestates,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Realestate);

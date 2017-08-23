import React, { Component } from 'react';
import T from 'prop-types';
import { Icon } from 'antd';
import FontAwesome from 'react-fontawesome';
import ImageGallery from 'react-image-gallery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import numeral from 'numeral';
import _ from 'lodash';
import queryString from 'query-string';

// import ContactAgent from '../../components/ContactAgent';
import Wishlist from '../../components/Wish';
import PropertyShare from '../../modules/property/components/PropertyShare';

import { AgentContact } from '../../modules/agent';

import MapComponent from '../../components/Map/MapWithStreetView';
import NearbyPlace from '../../components/Map/MapNearbyPlace';

import { getProperties } from '../../modules/property/api';
import { receivePropertyEntity } from '../../modules/property/actions';

const mapStateToProps = (state, ownProps) => {
  const propertyId = _.get(ownProps, 'match.params.id');
  const property = _.get(state, `entities.properties.entities.${propertyId}`);
  return {
    propertyId,
    data: property,
  };
};

const actions = {
  getPropertyEntity: (propertyId, params) => {
    return (dispatch) => {
      getProperties(`?id=${propertyId}${params}`)
      .then((result) => {
        dispatch(receivePropertyEntity(propertyId, _.get(result, 'data.0')));
      });
    };
  },
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
class Property extends Component {

  static propTypes = {
    propertyId: T.string.isRequired,
    data: T.shape({
      id: T.string,
    }),
    location: T.shape().isRequired,
    actions: T.shape({
      getPropertyEntity: T.func,
    }).isRequired,
    history: T.shape().isRequired,
  }

  constructor(props) {
    super(props);
    const { getPropertyEntity } = props.actions;
    let params = '&enable=true&approve=true';
    if (props.location.search) {
      const search = queryString.parse(props.location.search);
      if (_.get(search, 'preview') === 'true') {
        params = '';
      }
    }
    getPropertyEntity(props.propertyId, params);
  }

  state = {
    showStreetView: false,
    clickWishlist: false,
    clickShare: false,
  }

  handleStreerView = () => {
    this.setState({
      showStreetView: !this.state.showStreetView,
    });
  }

  handleThumbnailClick = () => {
    if (this.state.showStreetView === false) return;
    this.setState({
      showStreetView: false,
    });
  }

  renderSlide = (item) => {
    const backgroundStyle = {
      background: `url(${item.original})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100%',
      height: '100%',
    };

    return (
      <div className="image-gallery-image" style={backgroundStyle} />
    );
  }

  handleWishlist = () => {
    this.setState({
      clickWishlist: true,
    });
  }

  handleShare = () => {
    this.setState({
      clickShare: true,
    });
  }

  callbackWishlist = () => {
    this.setState({
      clickWishlist: false,
    });
  }

  callbackShare = () => {
    this.setState({
      clickShare: false,
    });
  }

  render() {
    const { clickWishlist, clickShare } = this.state;
    const { data, history } = this.props;

    if (!_.size(data)) return <div />;

    let images = [];
    images.push({
      original: _.get(data, 'mainImage.file.url'),
      thumbnail: _.get(data, 'mainImage.file.url'),
    });

    if (_.size(data.images) > 0) {
      _.forEach(data.images, (image) => {
        images.push({
          original: _.get(image, 'file.url'),
          thumbnail: _.get(image, 'file.url'),
        });
      });
    }

    images = _.uniqBy(images, 'original');

    const showThumbnails = _.size(images) > 1 ? true : false;

    return (
      <div id="Property">
        <div className="action">
          <div className="container">
            <div className="row">
              <div className="col-md-9 vcenter">
                <div role="button" tabIndex="0" className="backhome" onClick={() => history.goBack()} >
                  <FontAwesome name="angle-left" /> กลับไปที่ค้นหา
                </div>
                <div className="address">
                  <b>สำหรับ{data.for} {'>'} {/* {data.province} {'>'} {data.amphur} {'>'} {data.district} {'>'} */} </b>
                  <span className="text-gray">{data.address}</span>
                </div>
              </div>
              <div className="col-md-3 vcenter buttons">
                <div role="button" tabIndex="0" className="wishlist-button" onClick={this.handleWishlist}>
                  <Wishlist item={data} isClicked={clickWishlist} onChange={this.callbackWishlist} /> บันทึก
                </div>
                <div role="button" tabIndex="0" className="share-button" onClick={this.handleShare}>
                  <PropertyShare item={data} isClicked={clickShare} onChange={this.callbackShare} /> แบ่งบัน
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
                <div className={`cover ${this.state.showStreetView === true ? 'show-street-view' : 'show-banner'}`}>
                  <div className="street-view">
                    <div className="block">
                      <MapComponent center={{ lat: data.location.lat, lng: data.location.lon }} />
                    </div>
                  </div>
                  <ImageGallery
                    items={images}
                    slideInterval={2000}
                    showPlayButton={false}
                    onThumbnailClick={this.handleThumbnailClick}
                    showThumbnails={showThumbnails}
                    renderItem={this.renderSlide}
                  />
                  {/*<div className="google-map">
                    <div className="clearfix">
                      <div className="pull-left text-center">
                        <div role="button" tabIndex="0" onClick={this.handleStreerView}>
                          <img src={`${process.env.PUBLIC_URL} /images/googlemap/map-mark.jpg`} alt="Map View" />
                        </div>
                        <div>Map/Street View</div>
                      </div>
                      <div className="pull-right text-center">
                        <div role="button" tabIndex="0" onClick={this.handleStreerView}>
                          <img src={`${process.env.PUBLIC_URL} /images/googlemap/map-street.jpg`} alt="Street View" />
                        </div>
                        <div>Street View</div>
                      </div>
                    </div>
                  </div>*/}
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
                              <div className="col-md-5 vcenter">
                                <div className="price-block">
                                  <div className="for">{data.for}</div>
                                  <div className="price">฿{numeral(data.price).format('0,0')}</div>
                                  <div className="create_date">อยู่ในพรอพช็อปมาแล้ว {data.inWebsite} วัน</div>
                                  <div className="last_update">(ข้อมูลปรับปรุงล่าสุดเมื่อวันที่ {data.lastUpdate})</div>
                                </div>
                              </div>
                              <div className="col-md-7 vcenter">
                                <div className="address-block">
                                  <div className="address_1">{data.project}</div>
                                  <div className="address_2">{data.address}</div>
                                  {/*<div className="address_2">ถนน{data.street} เขต{data.amphur} {data.province} {data.zipcode}</div>*/}
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
                              {data.announceDetails &&
                                <div>
                                  {data.announceDetails.split('\n').map((item, key) => {
                                    return <span key={key.toString()}>{item}<br /></span>;
                                  })}
                                </div>
                              }
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                    {_.get(data, 'agent.id') &&
                      <div className="col-sm-6 col-md-4" style={{ paddingLeft: 0 }} >
                        <div className="contact-block">
                          <div className="agent-block">
                            <div className="row">
                              <div className="col-xs-4 vcenter">
                                <div className="agent-image">
                                  {_.get(data, 'agent.image') &&
                                    <img src={_.get(data, 'agent.image')} alt={`${_.get(data, 'agent.name')} ${_.get(data, 'agent.lastname')}`} />
                                  }
                                </div>
                              </div>
                              <div className="col-xs-8 vcenter">
                                <div className="agent-info">
                                  {(_.get(data, 'agent.name') || _.get(data, 'agent.lastname')) &&
                                    <div className="name">{_.get(data, 'agent.name')} {_.get(data, 'agent.lastname')}</div>
                                  }
                                  {/*
                                  <div className="rating">
                                    <Rate disabled defaultValue={data.agent.rate.rating} />
                                    <span>({agent.rate.count})</span>
                                  </div>
                                  */}
                                  {_.get(data, 'agent.phone') &&
                                    <div className="phone">{_.get(data, 'agent.phone')}</div>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                          <AgentContact
                            domain="property"
                            agentId={data.agent.id}
                            emailTo={data.agent.email}
                            agentName={data.agent.username}
                            propertyId={data.id}
                            projectName={data.project}
                          />
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
                      {_.size(_.get(data, 'tags')) > 0 &&
                        <span>
                          {
                            _.map(data.tags, (value) => {
                              return <div className="col-md-3" key={value}><Icon type="check-circle" /> {value}</div>;
                            })
                          }
                        </span>
                      }
                      {/*{_.size(_.get(data, 'specialFeatureView')) > 0 &&
                        <span>
                          {
                            _.map(data.specialFeatureView, (value) => {
                              return <div className="col-md-3" key={value}><Icon type="check-circle" /> {value}</div>;
                            })
                          }
                        </span>
                      }
                      {_.size(_.get(data, 'specialFeatureFacilities')) > 0 &&
                        <span>
                          {
                            _.map(data.specialFeatureFacilities, (value) => {
                              return <div className="col-md-3" key={value}><Icon type="check-circle" /> {value}</div>;
                            })
                          }
                        </span>
                      }
                      {_.size(_.get(data, 'specialFeatureNearbyPlaces')) > 0 &&
                        <span>
                          {
                            _.map(data.specialFeatureNearbyPlaces, (value) => {
                              return <div className="col-md-3" key={value}><Icon type="check-circle" /> {value}</div>;
                            })
                          }
                        </span>
                      }
                      {_.size(_.get(data, 'specialFeaturePrivate')) > 0 &&
                        <span>
                          {
                            _.map(data.specialFeaturePrivate, (value) => {
                              return <div className="col-md-3" key={value}><Icon type="check-circle" /> {value}</div>;
                            })
                          }
                        </span>
                      }*/}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fee-block">
                        <h4>ค่าธรรมเนียมและภาษี:</h4>
                        <div className="text-gray">ประมาณ {numeral(data.fee).format('0,0')} บาท</div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
            {_.get(data, 'location.lat') && _.get(data, 'location.lon') &&
              <div className="row">
                <div className="col-md-12">
                  <section className="info nearby_place">
                    <h2>สถานที่ใกล้เคียง</h2>
                    <NearbyPlace lat={data.location.lat} lng={data.location.lon} />
                  </section>
                </div>
              </div>
            }
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
});

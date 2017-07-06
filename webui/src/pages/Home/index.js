import React, { Component } from 'react';
import { Tabs, Input, Select, Button, Slider } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import numeral from 'numeral';
import queryString from 'query-string';

import BannerRealEstate from '../../containers/BannerRealEstate';
import SpecialFeature from '../../containers/SpecialFeature';

import LoadingComponent from '../../components/Loading';
import RealEstateItem from '../../components/RealEstateItem';
import SelectSellType from '../../components/SelectSellType';
import SelectResidentialType from '../../components/SelectResidentialType';
import SelectRoom from '../../components/SelectRoom';
import SelectElectricTrain from '../../components/SelectElectricTrain';

import * as UserActions from '../../actions/user-actions';
import * as RealestateActions from '../../actions/realestate-actions';
import * as ConfigActions from '../../actions/config-actions';

import * as firebase from '../../api/firebase';
import * as helpers from '../../helpers';

import BTSStationJSON from '../../../public/data/BTSStation.json';
import MRTStationJSON from '../../../public/data/MRTStation.json';
import BRTStationJSON from '../../../public/data/BRTStation.json';

const electricTrainStation = {
  bts: BTSStationJSON,
  mrt: MRTStationJSON,
  brt: BRTStationJSON,
};

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Home extends Component {

  headerHeight: 0;

  constructor(props) {
    super(props);
    this.getProfile(props);
    this.getConfig(props);
    this.goFilter(props.location);
  }

  state = {
    advanceExpand: false,
    electricTrain: [],
  }

  componentDidMount() {
    document.getElementById('Footer').style.visibility = 'hidden';
    document.addEventListener('scroll', this.handleScroll);
    this.headerHeight = document.getElementById('Header').clientHeight;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.goFilter(nextProps.location);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  getProfile = (props) => {
    firebase.core().auth().onAuthStateChanged((user) => {
      if (user) {
        const { fetchUserProfile } = props.actions;
        fetchUserProfile(user);
      }
    });
  }

  getConfig = (props) => {
    const { fetchConfigs } = props.actions;
    fetchConfigs();
  }

  handleScroll = (event) => {
    const scroolHeight = document.body.scrollTop + window.innerHeight;
    const bodyHeight = document.getElementsByClassName('layout-right')[0].clientHeight + this.headerHeight;
    if (scroolHeight >= bodyHeight) {
      document.getElementsByClassName("PropShop")[0].classList.add('end');
    } else {
      if (document.getElementsByClassName("PropShop")[0].classList.contains('end')) {
        document.getElementsByClassName("PropShop")[0].classList.remove('end');
      }
    }    
  }

  goFilter = (location) => {
    const search = location.search;
    if (search) {
      const { fetchRealestates } = this.props.actions;
      fetchRealestates(queryString.parse(search));
    } else {
      this.props.realestate.filter = false;
    }
  }

  delay = (() => {
    let timer = 0;
    return (callback, ms) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  handleFilterFor = (value) => {
    this.filter('for', value);
  }

  handleFilterElectricTrain = (value) => {
    this.setState({
      electricTrain: value,
    });
  }

  handleFilterElectricTrainStation = (value) => {
    this.filter('location', value);
  }

  handleFilterInput = (e) => {
    const value = e.target.value;
    this.delay(() => {
      this.filter('query', value);
    }, 1000);
  }

  handleFilterPrice = (value) => {
    this.delay(() => {
      this.filter('priceMin', value[0]);
      this.filter('priceMax', value[1]);
    }, 1000);
  }

  handleFilterResidentialType = (value) => {
    this.filter('residentialType', value);
  }

  handleFilterBedRoom = (value) => {
    this.filter('bedroom', value);
  }

  handleFilterBathRoom = (value) => {
    this.filter('bathroom', value);
  }

  handleFilterSpecialFeature = (data) => {
    const { location } = this.props;

    let search = {};

    const param = location.search;
    if (param) {
      search = queryString.parse(param);
    }

    search['specialFeatureView'] = data.specialFeatureView.join();
    search['specialFeatureFacilities'] = data.specialFeatureFacilities.join();
    search['specialFeatureNearbyPlaces'] = data.specialFeatureNearbyPlaces.join();
    search['specialFeaturePrivate'] = data.specialFeaturePrivate.join();

    this.setAdvanceExpand();

    const stringified = queryString.stringify(search);
    this.setUrl(stringified);
  }

  filter = (key, value) => {
    const stringified = this.convertObjectToQueryString(key, value);
    this.setUrl(stringified);
  }

  convertObjectToQueryString = (key, value) => {
    const { location } = this.props;

    let search = {};

    const param = location.search;
    if (param) {
      search = queryString.parse(param);
    }

    search[key] = value;

    return queryString.stringify(search);
  }

  setUrl = (stringified) => {
    const { history } = this.props;
    history.push({
      pathname: '/',
      search: '?'+decodeURIComponent(stringified),
    });
  }

  handleAdvanceExpand = (e) => {
    this.setAdvanceExpand();
  }

  setAdvanceExpand = () => {
    this.setState(prevState => ({
      advanceExpand: !prevState.advanceExpand,
    }));
  }

  renderSelectOption = (limit) => {
    const data = [];
    for (let i = 1; i <= limit; i++) { 
      data.push(<Option key={i.toString(36)} value={i.toString(36)}>{i.toString(36)}</Option>);
    }
    return data;
  }

  tipFormatter = (value) => {
    return numeral(value).format('0,0') + ' บาท';
  }

  render() {

    const { banner, realestate, configRealestate, location } = this.props;
    const { advanceExpand } = this.state;

    const stepMarks = {
      [configRealestate.data.priceMin]: {
        style: {
          color: '#484849',
        },
        label: helpers.convertRealestatePrice(configRealestate.data.priceMin),
      },
      [configRealestate.data.priceMax]: {
        style: {
          color: '#484849',
        },
        label: helpers.convertRealestatePrice(configRealestate.data.priceMax),
      },
    };

    let search = [];
    const param = location.search;
    if (param) {
      search = queryString.parse(param);
    }

    const defaultSelected = {
      for: search.for ? search.for : [],
      location: search.location ? search.location : [],
      query: search.query ? search.query : [],
      price: {
        min: search.priceMin ? parseInt(search.priceMin, 10) : configRealestate.data.priceMin,
        max: search.priceMax ? parseInt(search.priceMax, 10) : configRealestate.data.priceMax,
      },
      residentialType: search.residentialType ? search.residentialType : [],
      room: {
        bedroom: search.bedroom ? search.bedroom : [],
        bathroom: search.bathroom ? search.bathroom : [],
      },
      specialFeature: {
        specialFeatureView: search.specialFeatureView ? search.specialFeatureView.split(',') : [],
        specialFeatureFacilities: search.specialFeatureFacilities ? search.specialFeatureFacilities.split(',') : [],
        specialFeatureNearbyPlaces: search.specialFeatureNearbyPlaces ? search.specialFeatureNearbyPlaces.split(',') : [],
        specialFeaturePrivate: search.specialFeaturePrivate ? search.specialFeaturePrivate.split(',') : [],
      },
    };

    return (
      <div id="Home">
        <div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            <BannerRealEstate />
          </div>
          <div className="col-md-6 col-md-offset-6 layout-right">
            {configRealestate.loading === true ? (
              <LoadingComponent />
            ) : (
              <div className="filter_real_estate">
                <Tabs defaultActiveKey="1">
                  <TabPane tab="เลือกจากทำเล / โครงการ" key="1">
                    <div className="row row_1">
                      <div className="col-sm-3">
                        <div style={{ width: '100%' }}>
                          <SelectSellType placeholder="ซื้อ / เช่า" type="buyer" defaultValue={defaultSelected.for} onChange={this.handleFilterFor} />
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <Input placeholder="กรอกทำเลหรือชื่อโครงการที่ต้องการ" defaultValue={defaultSelected.query} style={{ width: '100%' }} onChange={this.handleFilterInput} />
                      </div>
                    </div>
                    <div className="row row_2">
                      <div className="col-sm-4 col-md-4" style={{ minWidth: 250 }} >
                        <div className="price_length">
                          <div className="clearfix">
                            <div className="pull-left text-gray" style={{ fontSize: 12 }} >ขั้นต่ำ</div>
                            <div className="pull-right text-gray" style={{ fontSize: 12 }} >ไม่เกิน</div>
                          </div>
                          <Slider range marks={stepMarks} defaultValue={[defaultSelected.price.min, defaultSelected.price.max]} min={configRealestate.data.priceMin} max={configRealestate.data.priceMax} onChange={this.handleFilterPrice} tipFormatter={this.tipFormatter} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-residential-type" style={{ minWidth: 135 }} >
                        <div style={{ width: '100%' }} >
                          <SelectResidentialType placeholder="ประเภทอสังหาฯ" defaultValue={defaultSelected.residentialType} onChange={this.handleFilterResidentialType} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-room col-bedroom" style={{ minWidth: 92 }} >
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องนอน" defaultValue={defaultSelected.bedroom} onChange={this.handleFilterBedRoom} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-room col-bathroom" style={{ minWidth: 92 }} >
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องน้ำ" defaultValue={defaultSelected.bathroom} onChange={this.handleFilterBathRoom} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-advance" style={{ minWidth: 130 }} >
                        <Button style={{ width: '100%' }} className={"btn-main " + (advanceExpand === true ? 'active' : '')} onClick={this.handleAdvanceExpand}>ตัวเลือกเพิ่มเติม</Button>
                      </div>
                    </div>
                    {advanceExpand === true &&
                      <div className="row">
                        <div className="col-md-12">
                          <div className="filter_advance">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="property_block">
                                  <SpecialFeature items={configRealestate.data.specialFeature} defaultValue={defaultSelected.specialFeature} onSelect={this.handleFilterSpecialFeature} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </TabPane>
                  <TabPane tab="ใกล้สถานีรถไฟฟ้า" key="2">
                    <div className="row row_1">
                      <div className="col-md-3">
                        <div style={{ width: '100%' }}>
                          <SelectSellType placeholder="ซื้อ / เช่า" defaultValue={defaultSelected.for} onChange={this.handleFilterFor} />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div style={{ width: '100%' }}>
                          <SelectElectricTrain value={this.state.electricTrain} onChange={this.handleFilterElectricTrain} />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <Select placeholder="สถานีรถไฟฟ้า" value={defaultSelected.location} disabled={_.size(this.state.electricTrain) ? false : true} style={{ width: '100%' }} onChange={this.handleFilterElectricTrainStation} >
                          {this.state.electricTrain &&
                            _.map(electricTrainStation[this.state.electricTrain], (value) => {
                              return <Option value={value.Position}>{value.StationNameTH}</Option>;
                            })
                          }
                        </Select>
                      </div>
                      <div className="col-md-3">
                        <Select placeholder="รัศมีการเดินทาง" style={{ width: '100%' }} >
                          <Option value="xxxxxxxxxxxxxxxxx">xxxxxxxxxxxxxxxxx</Option>
                        </Select>
                      </div>
                    </div>
                    <div className="row row_2">
                      <div className="col-sm-4 col-md-4" style={{ minWidth: 250 }} >
                        <div className="price_length">
                          <div className="clearfix">
                            <div className="pull-left text-gray" style={{ fontSize: 12 }} >ขั้นต่ำ</div>
                            <div className="pull-right text-gray" style={{ fontSize: 12 }} >ไม่เกิน</div>
                          </div>
                          <Slider range marks={stepMarks} defaultValue={[defaultSelected.price.min, defaultSelected.price.max]} min={configRealestate.data.priceMin} max={configRealestate.data.priceMax} onChange={this.handleFilterPrice} tipFormatter={this.tipFormatter} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-residential-type" style={{ minWidth: 135 }} >
                        <div style={{ width: '100%' }} >
                          <SelectResidentialType placeholder="ประเภทอสังหาฯ" defaultValue={defaultSelected.residentialType} onChange={this.handleFilterResidentialType} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-room col-bedroom" style={{ minWidth: 92 }} >
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องนอน" defaultValue={defaultSelected.bedroom} onChange={this.handleFilterBedRoom} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-room col-bathroom" style={{ minWidth: 92 }} >
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องน้ำ" defaultValue={defaultSelected.bathroom} onChange={this.handleFilterBathRoom} />
                        </div>
                      </div>
                      <div className="col-xs-2 col-sm-2 col-md-2 col-advance" style={{ minWidth: 130 }} >
                        <Button style={{ width: '100%' }} className={"btn-main " + (advanceExpand === true ? 'active' : '')} onClick={this.handleAdvanceExpand}>ตัวเลือกเพิ่มเติม</Button>
                      </div>
                    </div>
                    {advanceExpand === true &&
                      <div className="row">
                        <div className="col-md-12">
                          <div className="filter_advance">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="property_block">
                                  <SpecialFeature items={configRealestate.data.specialFeature} defaultValue={defaultSelected.specialFeature} onSelect={this.handleFilterSpecialFeature} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </TabPane>
                </Tabs>
              </div>
            )}
            <hr />
            {realestate.filter === true ? (
              <div className="result">
                {realestate.loading === true ? (
                  <LoadingComponent />
                ) : (
                  <div className="list">
                    <h3>{realestate.data.length} ผลการค้นหา</h3>
                    <ul>
                      {
                        _.map(realestate.data, (item, index) => {
                          return (
                            <li key={index} className="item col-sm-4 col-lg-6 col-lg-4"><RealEstateItem item={item} type="sell" /></li>
                          );
                        })
                      }
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="result">
                {Object.keys(banner.condo).length > 0 &&
                    <div className="list clearfix">
                      <h3>คอนโด</h3>
                      <ul>
                        {
                          _.map(banner.condo, (row, index) => {
                            const rowMD = 12 / Object.keys(row).length;
                            return (
                              <li key={index}>
                                <ul>
                                  {
                                    _.map(row, (item, index2) => {
                                      return (
                                        <li key={index2} className={"item col-sm-"+rowMD+" col-md-6 col-lg-"+rowMD}><RealEstateItem item={item} type="sell" /></li>
                                      );
                                    })
                                  }
                                </ul>
                              </li>
                            );
                          })
                        }
                      </ul>
                    </div>
                  }
                  {Object.keys(banner.house).length > 0 &&
                    <div className="list clearfix">
                      <h3>บ้าน</h3>
                      <ul>
                        {
                          _.map(banner.house, (row, index) => {
                            const rowMD = 12 / Object.keys(row).length;
                            return (
                              <li key={index}>
                                <ul>
                                  {
                                    _.map(row, (item, index2) => {
                                      return (
                                        <li key={index2} className={"item col-sm-"+rowMD+" col-md-6 col-lg-"+rowMD}><RealEstateItem item={item} type="sell" /></li>
                                      );
                                    })
                                  }
                                </ul>
                              </li>
                            );
                          })
                        }
                      </ul>
                    </div>
                  }
                  {/*
                  <div className="list news">
                    <h3>ข่าวสารและบทความ</h3>
                    <div className="row">
                      <div className="col-md-4"></div>
                      <div className="col-md-4"></div>
                      <div className="col-md-4"></div>
                    </div>
                  </div>
                  */}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('mapStateToProps', state);
  return {
    user: state.user.data,
    banner: state.banners,
    realestate: state.realestates,
    configRealestate: state.config,
  };
};

const actions = {
  fetchUserProfile: UserActions.fetchUserProfile,
  fetchRealestates: RealestateActions.fetchRealestates,
  fetchConfigs: ConfigActions.fetchConfigs,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

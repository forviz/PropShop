import React, { Component } from 'react';
import { Tabs, Input, Select, Button } from 'antd';
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
import SelectPrice from '../../components/SelectPrice';
import SelectResidentialType from '../../components/SelectResidentialType';
import SelectRoom from '../../components/SelectRoom';
import SelectElectricTrain from '../../components/SelectElectricTrain';
import SelectElectricTrainStation from '../../components/SelectElectricTrainStation';
import SelectRadius from '../../components/SelectRadius';
import MapLocation from '../../components/Map/MapLocation';
import SearchInput from '../../containers/SearchInput';

import * as UserActions from '../../actions/user-actions';
import * as RealestateActions from '../../actions/realestate-actions';
import * as ConfigActions from '../../actions/config-actions';

import * as firebase from '../../api/firebase';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const mapStateToProps = (state) => {
  const propertySearch = _.get(state, 'domain.propertySearch');
  const visibleIDs = propertySearch.visibleIDs;

  const properties = _.map(visibleIDs, id => _.get(state, `entities.properties.entities.${id}`));
  return {
    user: state.user.data,
    banner: state.banners,
    // realestate: state.realestates,
    realestate: {
      filter: true,
      data: _.compact(properties),
      total: propertySearch.total,
    },
    configRealestate: state.config,
  };
};

const actions = {
  fetchUserProfile: UserActions.fetchUserProfile,
  searchProperties: RealestateActions.searchProperties,
  fetchConfigs: ConfigActions.fetchConfigs,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

class Home extends Component {

  headerHeight: 0;

  constructor(props) {
    super(props);
    this.getProfile(props);
    this.getConfig(props);
    // this.goFilter(props.location);
  }

  state = {
    advanceExpand: false,
  }

  componentDidMount() {
    document.getElementById('Footer').style.visibility = 'hidden';
    document.addEventListener('scroll', this.handleScroll);
    this.headerHeight = document.getElementById('Header').clientHeight;

    const { searchProperties } = this.props.actions;
    searchProperties(this.props.location.search);
  }

  componentWillReceiveProps(nextProps) {
    const { searchProperties, getPropertyEntities } = nextProps.actions;
    if (!_.isEqual(nextProps.location, this.props.location)) {
      searchProperties(nextProps.location.search);
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

  handleScroll = () => {
    const scroolHeight = document.body.scrollTop + window.innerHeight;
    const bodyHeight = document.getElementsByClassName('layout-right')[0].clientHeight + this.headerHeight;
    if (scroolHeight >= bodyHeight) {
      document.getElementsByClassName('PropShop')[0].classList.add('end');
    } else {
      if (document.getElementsByClassName('PropShop')[0].classList.contains('end')) {
        document.getElementsByClassName('PropShop')[0].classList.remove('end');
      }
    }
  }

  // goFilter = (location) => {
  //   const search = location.search;
  //   if (search) {
  //     const { searchProperties } = this.props.actions;
  //     searchProperties(search);
  //   } else {
  //     this.props.realestate.filter = false;
  //   }
  // }

  delay = (() => {
    let timer = 0;
    return (callback, ms) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  setUrl = (stringified) => {
    const { history } = this.props;
    history.push({
      search: `?${decodeURIComponent(stringified)}`,
    });
  }

  filter = (key, value) => {
    const stringified = this.convertObjectToQueryString(key, value);
    this.setUrl(stringified);
  }

  handleFilterFor = (value) => {
    this.filter('for', value);
  }

  handleFilterElectricTrain = (value) => {
    const { location } = this.props;

    let search = {};

    const param = location.search;
    if (param) {
      search = queryString.parse(param);
    }

    search.electricTrain = value;
    delete search.location;
    delete search.radius;

    const stringified = queryString.stringify(search);
    this.setUrl(stringified);
  }

  handleFilterElectricTrainStation = (value) => {
    const { location } = this.props;

    let search = {};

    const param = location.search;
    if (param) {
      search = queryString.parse(param);
    }

    search.location = value;
    search.radius = 10;

    const stringified = queryString.stringify(search);
    this.setUrl(stringified);
  }

  handleFilterRadius = (value) => {
    this.filter('radius', value);
  }

  handleFilterInput = (value) => {
    this.delay(() => {
      this.filter('query', value);
    }, 1000);
  }

  handleFilterPrice = (key, value) => {
    this.filter(key, value);
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

    search.specialFeatureView = data.specialFeatureView.join();
    search.specialFeatureFacilities = data.specialFeatureFacilities.join();
    search.specialFeatureNearbyPlaces = data.specialFeatureNearbyPlaces.join();
    search.specialFeaturePrivate = data.specialFeaturePrivate.join();

    this.setAdvanceExpand();

    const stringified = queryString.stringify(search);
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

  handleAdvanceExpand = () => {
    this.setAdvanceExpand();
  }

  setAdvanceExpand = () => {
    this.setState(prevState => ({
      advanceExpand: !prevState.advanceExpand,
    }));
  }

  renderSelectOption = (limit) => {
    const data = [];
    for (let i = 1; i <= limit; i += 1) {
      data.push(<Option key={i.toString()} value={i.toString()}>{i.toString()}</Option>);
    }
    return data;
  }

  tipFormatter = (value) => {
    return `${numeral(value).format('0,0')} บาท`;
  }

  handleMapLocation = (map) => {
    const mapBound = map.getBounds();
    const ne = mapBound.getNorthEast().toJSON();
    const sw = mapBound.getSouthWest().toJSON();
    this.filter('bound', `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`);
  }

  render() {
    const { banner, realestate, configRealestate, location } = this.props;
    const { advanceExpand } = this.state;

    console.log('realestate spyrocash', realestate);

    let search = [];
    const param = location.search;
    if (param) {
      search = queryString.parse(param);
    }

    const defaultSelected = {
      for: search.for ? search.for : [],
      electricTrain: search.electricTrain ? search.electricTrain : [],
      location: search.location ? search.location : [],
      radius: search.radius ? search.radius : [],
      query: search.query ? search.query : [],
      price: {
        min: search.priceMin ? parseInt(search.priceMin, 10) : [],
        max: search.priceMax ? parseInt(search.priceMax, 10) : [],
      },
      residentialType: search.residentialType ? search.residentialType : [],
      bedroom: search.bedroom ? search.bedroom : [],
      bathroom: search.bathroom ? search.bathroom : [],
      specialFeature: {
        specialFeatureView: search.specialFeatureView ? search.specialFeatureView.split(',') : [],
        specialFeatureFacilities: search.specialFeatureFacilities ? search.specialFeatureFacilities.split(',') : [],
        specialFeatureNearbyPlaces: search.specialFeatureNearbyPlaces ? search.specialFeatureNearbyPlaces.split(',') : [],
        specialFeaturePrivate: search.specialFeaturePrivate ? search.specialFeaturePrivate.split(',') : [],
      },
    };

    const defaultActiveKey = search.electricTrain ? '2' : '1';

    return (
      <div id="Home">
        <div className="row">
          <div className="hidden-xs hidden-sm col-md-6 layout-left">
            {_.size(search) > 0 ? (
              <MapLocation value={defaultSelected.location} nearby={realestate.data} onDragEnd={this.handleMapLocation} />
            ) : (
              <BannerRealEstate />
            )}
          </div>
          <div className="col-md-6 col-md-offset-6 layout-right">
            {configRealestate.loading === true ? (
              <LoadingComponent />
            ) : (
              <div className="filter_real_estate">
                <Tabs defaultActiveKey={defaultActiveKey}>
                  <TabPane tab="เลือกจากทำเล / โครงการ" key="1">
                    <div className="row row_1">
                      <div className="col-sm-3">
                        <div style={{ width: '100%' }} >
                          <SelectResidentialType
                            placeholder="ประเภทอสังหาฯ"
                            value={defaultSelected.residentialType}
                            onChange={this.handleFilterResidentialType}
                          />
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <SearchInput
                          placeholder="กรอกทำเลหรือชื่อโครงการที่ต้องการ"
                          defaultValue={defaultSelected.query}
                          style={{ width: '100%' }}
                          onChange={this.handleFilterInput}
                        />
                      </div>
                    </div>
                    <div className="row row_2">
                      <div className="col-sm-3">
                        <div style={{ width: '100%' }}>
                          <SelectSellType
                            type="buyer"
                            placeholder="ลักษณะการขาย"
                            value={defaultSelected.for}
                            onChange={this.handleFilterFor}
                          />
                        </div>
                      </div>
                      <div className="col-sm-2 col-bedroom">
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องนอน" value={defaultSelected.bedroom} onChange={this.handleFilterBedRoom} />
                        </div>
                      </div>
                      <div className="col-sm-2 col-bathroom">
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องน้ำ" value={defaultSelected.bathroom} onChange={this.handleFilterBathRoom} />
                        </div>
                      </div>
                      <div className="col-sm-3 col-price">
                        <div style={{ width: '100%' }} >
                          <SelectPrice value={defaultSelected.price} onChange={this.handleFilterPrice} />
                        </div>
                      </div>
                      <div className="col-sm-2 col-advance">
                        <Button
                          style={{ width: '100%' }}
                          className={`btn-main ${advanceExpand === true ? 'active' : ''}`}
                          onClick={this.handleAdvanceExpand}
                        >ตัวเลือกเพิ่มเติม</Button>
                      </div>
                    </div>
                    {advanceExpand === true &&
                      <div className="row">
                        <div className="col-md-12">
                          <div className="filter_advance">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="property_block">
                                  <SpecialFeature
                                    items={configRealestate.data.specialFeature}
                                    defaultValue={defaultSelected.specialFeature}
                                    onSelect={this.handleFilterSpecialFeature}
                                  />
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
                      <div className="col-sm-3">
                        <div style={{ width: '100%' }} >
                          <SelectResidentialType
                            placeholder="ประเภทอสังหาฯ"
                            value={defaultSelected.residentialType}
                            onChange={this.handleFilterResidentialType}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div style={{ width: '100%' }}>
                          <SelectElectricTrain
                            value={defaultSelected.electricTrain}
                            onChange={this.handleFilterElectricTrain}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div style={{ width: '100%' }}>
                          <SelectElectricTrainStation
                            value={defaultSelected.location}
                            train={defaultSelected.electricTrain}
                            onChange={this.handleFilterElectricTrainStation}
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div style={{ width: '100%' }}>
                          <SelectRadius
                            value={defaultSelected.radius}
                            onChange={this.handleFilterRadius}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row row_2">
                      <div className="col-sm-3">
                        <div style={{ width: '100%' }}>
                          <SelectSellType
                            type="buyer"
                            placeholder="ลักษณะการขาย"
                            value={defaultSelected.for}
                            onChange={this.handleFilterFor}
                          />
                        </div>
                      </div>
                      <div className="col-sm-2 col-bedroom">
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องนอน" value={defaultSelected.bedroom} onChange={this.handleFilterBedRoom} />
                        </div>
                      </div>
                      <div className="col-sm-2 col-bathroom">
                        <div style={{ width: '100%' }} >
                          <SelectRoom placeholder="ห้องน้ำ" value={defaultSelected.bathroom} onChange={this.handleFilterBathRoom} />
                        </div>
                      </div>
                      <div className="col-sm-3 col-price">
                        <div style={{ width: '100%' }} >
                          <SelectPrice value={defaultSelected.price} onChange={this.handleFilterPrice} />
                        </div>
                      </div>
                      <div className="col-sm-2 col-advance">
                        <Button
                          style={{ width: '100%' }}
                          className={`btn-main ${advanceExpand === true ? 'active' : ''}`}
                          onClick={this.handleAdvanceExpand}
                        >ตัวเลือกเพิ่มเติม</Button>
                      </div>
                    </div>
                    {advanceExpand === true &&
                      <div className="row">
                        <div className="col-md-12">
                          <div className="filter_advance">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="property_block">
                                  <SpecialFeature
                                    items={configRealestate.data.specialFeature}
                                    defaultValue={defaultSelected.specialFeature}
                                    onSelect={this.handleFilterSpecialFeature}
                                  />
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
                                      <li key={index2} className={`item col-sm-${rowMD} col-md-6 col-lg-${rowMD}`}>
                                        <RealEstateItem item={item} type="sell" />
                                      </li>
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
                                      <li key={index2} className={`item col-sm-${rowMD} col-md-6 col-lg-${rowMD}`}>
                                        <RealEstateItem item={item} type="sell" />
                                      </li>
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
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

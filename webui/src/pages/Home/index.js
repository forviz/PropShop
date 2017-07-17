import React, { Component } from 'react';
import T from 'prop-types';
import { Tabs, Select, Button } from 'antd';
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
import SearchAreaInput from '../../containers/SearchAreaInput';

import * as UserActions from '../../actions/user-actions';
import * as RealestateActions from '../../actions/realestate-actions';
import * as ConfigActions from '../../actions/config-actions';

import * as firebase from '../../api/firebase';

import LandingPage from './LandingPage';

import { convertLocationToLatLngZoom, convertLatLngZoomToLocation, getDistance } from '../../helpers/map-helpers';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class SearchParameters {
  area: string;
  location: string;

  bound: string;
  bedroom: number;
  bathroom: number;
  price: {
    min: number;
    max: number;
  };
}

const priceListSale = [
  500000, 1000000, 1500000, 2000000, 2500000,
  3000000, 3500000, 4000000, 4500000, 5000000,
  5500000, 6000000, 6500000, 7000000, 7500000,
  8000000, 8500000, 9000000, 9500000, 10000000,
  11000000, 12000000, 13000000, 14000000,
  15000000, 20000000, 50000000];

const priceListRent = [0, 2000, 4000, 6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000];

const convertRouterPropsToParams = (props, areaEntities) => {

  const search = queryString.parse(_.get(props, 'location.search', {}));
  // console.log('convertRouterPropsToParams', search);
  const areaSlug = _.get(props, 'match.params.area');
  return {
    area: areaSlug,
    location: _.get(areaEntities, `${areaSlug}.location`),
    for: _.replace(_.get(props, 'match.params.for'), 'for-', ''),
    propertyType: _.split(_.get(props, 'match.params.propertyType'), ','),

    // Query Parameters
    bound: _.get(search, 'bound'),
    bedroom: _.get(search, 'bedroom') ? _.toNumber(_.get(search, 'bedroom')) : undefined,
    bathroom: _.get(search, 'bathroom') ? _.toNumber(_.get(search, 'bathroom')) : undefined,
    price: _.get(search, 'price') ? {
      min: _.toNumber(_.head(_.split(_.get(search, 'price'), '-'))),
      max: _.toNumber(_.last(_.split(_.get(search, 'price'), '-'))),
    } : { min: undefined, max: undefined },
  };
};

const convertParamsToLocationObject = (params) => {
  return {
    pathname: `/${params.propertyType}/for-${params.for}/${params.area}/`,
    search: `?${queryString.stringify({
      bound: _.get(params, 'bound'),
      bedroom: _.get(params, 'bedroom'),
      bathroom: _.get(params, 'bathroom'),
      price: (_.get(params, 'price.min') || _.get(params, 'price.max')) ?
        `${_.get(params, 'price.min', '0')}-${_.get(params, 'price.max', '')}`
        :
        undefined,
    })}`,
  };
};

const convertParamsToSearchAPI = (params) => {
  console.log('convertParamsToSearchAPI', params, queryString.stringify(params));
  const str = queryString.stringify({
    // id: undefined,
    // ids: undefined,
    // query,
    for: params.for,
    propertyType: _.join(_.get(params, 'propertyType'), ','),
    bedroom: _.get(params, 'bedroom') ? _.toNumber(_.get(params, 'bedroom')) : undefined,
    bathroom: _.get(params, 'bathroom') ? _.toNumber(_.get(params, 'bathroom')) : undefined,
    priceMin: _.get(params, 'price.min') ? _.toNumber(_.get(params, 'price.min')) : undefined,
    priceMax: _.get(params, 'price.max') ? _.toNumber(_.get(params, 'price.max')) : undefined,
    bound: _.get(params, 'bound'),
    location: undefined,
    // select
  });

  return `?${str}`;
};


const mapStateToProps = (state, ownProps) => {
  const propertySearch = _.get(state, 'domain.propertySearch');
  const visibleIDs = propertySearch.visibleIDs;

  const properties = _.map(visibleIDs, id => _.get(state, `entities.properties.entities.${id}`));

  const areaEntities = _.get(state, 'entities.areas.entities');
  return {
    searchParameters: convertRouterPropsToParams(ownProps, areaEntities),
    areas: areaEntities,
    areaDataSource: _.map(_.groupBy(_.map(areaEntities, (a, key) => ({ ...a, key })), (area) => {
      return area.category;
    }), (areas, category) => ({ title: category, children: areas })),
    user: state.user.data,
    banner: state.banners,
    userDidSearch: true, // _.get(ownProps, 'location.search') !== '',
    realestate: {
      filter: _.get(ownProps, 'location.search') !== '',
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

  static propTypes = {
    searchParameters: T.instanceOf(SearchParameters),
    actions: T.shape({
      searchProperties: T.func,
    }).isRequired,
  }

  static defaultProps = {
    searchParameters: {
      area: undefined,
      location: undefined,
      bound: undefined,
    },
  }
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
    // searchProperties(this.props.location.search);
    searchProperties(convertParamsToSearchAPI(this.props.searchParameters));
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', this.props.searchParameters, nextProps.searchParameters);
    console.log('isEqual', _.isEqual(nextProps.searchParameters, this.props.searchParameters));
    const { searchProperties } = nextProps.actions;
    if (!_.isEqual(nextProps.searchParameters, this.props.searchParameters)) {
      // const params = queryString.parse(nextProps.location.search);

      // if location is provide, convert to bound
      // console.log('searchparams', nextProps.searchParameters);
      // searchProperties(nextProps.location.search);
      searchProperties(convertParamsToSearchAPI(nextProps.searchParameters));
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

  setUrl = (params) => {
    const { history } = this.props;
    console.log('setUrl', params, convertParamsToLocationObject(params));
    history.push(convertParamsToLocationObject(params));
  }

  // filter = (key, value) => {
  //   const stringified = this.convertObjectToQueryString(key, value);
  //   this.setUrl(stringified);
  // }

  handleFilterFor = (value) => {
    // this.filter('for', value);
    const searchParameters = _.clone(this.props.searchParameters);
    searchParameters.for = value;

    // clear price min, max if exists
    searchParameters.price = { min: undefined, max: undefined };
    this.setUrl(searchParameters);
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
    console.log('handleFilterInput', value);
    // this.delay(() => {
    //   this.filter('query', value);
    // }, 1000);
  }

  handleSelectArea = (option) => {
    const searchParameters = _.clone(this.props.searchParameters);
    searchParameters.area = option.value;
    this.setUrl(searchParameters);
  }

  handleFilterPrice = (key, value) => {
    // this.filter(key, value);
    const searchParameters = _.clone(this.props.searchParameters);
    if (key === 'priceMin') {
      searchParameters.price = {
        ...searchParameters.price,
        min: _.toNumber(value),
      };
    }
    if (key === 'priceMax') {
      searchParameters.price = {
        ...searchParameters.price,
        max: _.toNumber(value),
      };
    }
    this.setUrl(searchParameters);
  }

  handleFilterResidentialType = (value) => {
    const searchParameters = _.clone(this.props.searchParameters);
    searchParameters.propertyType = value;
    this.setUrl(searchParameters);
  }

  handleFilterBedRoom = (value) => {
    // this.filter('bedroom', value);

    const searchParameters = _.clone(this.props.searchParameters);
    searchParameters.bedroom = value;
    this.setUrl(searchParameters);
  }

  handleFilterBathRoom = (value) => {
    // this.filter('bathroom', value);

    const searchParameters = _.clone(this.props.searchParameters);
    searchParameters.bathroom = value;
    this.setUrl(searchParameters);
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

  handleMapBoundChanged = (map) => {
    const mapBound = map.getBounds();
    const ne = mapBound.getNorthEast().toJSON();
    const sw = mapBound.getSouthWest().toJSON();

    const center = map.getCenter();
    const zoom = map.getZoom();
    console.log('MapBoundChanged', ne, sw, center);

    const searchParameters = this.props.searchParameters;
    searchParameters.location = `${center.lat()},${center.lng()},${zoom}z`;
    searchParameters.bound = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;


    // Check where is the nearest area of new center is
    const nearestArea = _.minBy(_.map(this.props.areas, (area, key) => ({ ...area, key })), (area) => {
      return getDistance(center.toJSON(), convertLocationToLatLngZoom(area.location));
    });

    if (nearestArea.key !== searchParameters.area) {
      searchParameters.area = nearestArea.key;
    }

    console.log('new searchParameters', searchParameters);
    this.setUrl(searchParameters);
  }

  render() {
    const { searchParameters, userDidSearch, banner, realestate, configRealestate, location } = this.props;
    const { advanceExpand } = this.state;

    let search = [];
    const param = location.search;
    if (param) {
      search = queryString.parse(param);
    }

    const defaultSelected = {
      for: search.for ? search.for : [],
      electricTrain: search.electricTrain ? search.electricTrain : [],
      location: search.location ? search.location : '',
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
            { userDidSearch ? (
              <MapLocation
                location={searchParameters.location}
                nearby={realestate.data}
                onBoundChanged={this.handleMapBoundChanged}
              />
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
                            value={searchParameters.propertyType}
                            onChange={this.handleFilterResidentialType}
                          />
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <SearchAreaInput
                          placeholder="กรอกทำเลหรือชื่อโครงการที่ต้องการ"
                          dataSource={this.props.areaDataSource}
                          style={{ width: '100%' }}
                          value={searchParameters.area}
                          onChange={this.handleFilterInput}
                          onSelect={this.handleSelectArea}
                        />
                      </div>
                    </div>
                    <div className="row row_2">
                      <div className="col-sm-3">
                        <div style={{ width: '100%' }}>
                          { /*<SelectSellType
                            type="buyer"
                            placeholder="ลักษณะการขาย"
                            value={defaultSelected.for}
                            onChange={this.handleFilterFor}
                          />*/ }
                          <Select
                            placeholder="ลักษณะการขาย"
                            value={searchParameters.for}
                            style={{ width: '100%' }}
                            onChange={this.handleFilterFor}
                          >
                            <Option value="sale">ขาย</Option>
                            <Option value="rent">เช่า</Option>
                          </Select>
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
                          <SelectPrice
                            priceList={searchParameters.for === 'sale' ? priceListSale : priceListRent}
                            value={searchParameters.price}
                            onChange={this.handleFilterPrice}
                          />
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
            {userDidSearch ? (
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
            ) : <LandingPage banner={banner} />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

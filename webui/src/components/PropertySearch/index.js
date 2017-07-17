import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import _ from 'lodash';
import queryString from 'query-string';

import { Tabs, Button, Select } from 'antd';

import SelectSellType from '../SelectSellType';
import SelectPrice from '../SelectPrice';
import SelectResidentialType from '../SelectResidentialType';
import SelectRoom from '../SelectRoom';
import SelectElectricTrain from '../SelectElectricTrain';
import SelectElectricTrainStation from '../SelectElectricTrainStation';
import SelectRadius from '../SelectRadius';
import SearchAreaInput from '../../containers/SearchAreaInput';
import SpecialFeature from '../../containers/SpecialFeature';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

const priceListSale = [
  500000, 1000000, 1500000, 2000000, 2500000,
  3000000, 3500000, 4000000, 4500000, 5000000,
  5500000, 6000000, 6500000, 7000000, 7500000,
  8000000, 8500000, 9000000, 9500000, 10000000,
  11000000, 12000000, 13000000, 14000000,
  15000000, 20000000, 50000000];

const priceListRent = [0, 2000, 4000, 6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000];

const mapStateToProps = (state) => {
  const areaEntities = _.get(state, 'entities.areas.entities');

  return {
    areaDataSource: _.map(_.groupBy(_.map(areaEntities, (a, key) => ({ ...a, key })), (area) => {
      return area.category;
    }), (areas, category) => ({ title: category, children: areas })),
  };
};

export default connect(mapStateToProps)(
class PropertySearch extends Component {

  static propTypes = {
    searchParameters: T.object,
    onUpdate: T.func
  }

  static defaultProps = {
    activeTab: 'area',
    searchParameters: {},
  }

  state = {
    advanceExpand: false,
  }

  handleAdvanceExpand = () => {
    this.setAdvanceExpand();
  }

  setAdvanceExpand = () => {
    this.setState(prevState => ({
      advanceExpand: !prevState.advanceExpand,
    }));
  }

  setUrl = (searchParameters) => {
    this.props.onUpdate(searchParameters);
  }

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

  render() {
    const { activeTab, searchParameters, areaDataSource } = this.props;
    const { advanceExpand } = this.state;

    return (
      <div className="filter_real_estate">
        <Tabs defaultActiveKey={activeTab}>
          <TabPane tab="เลือกจากทำเล / โครงการ" key="area">
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
                  <SelectRoom placeholder="ห้องนอน" value={searchParameters.bedroom} onChange={this.handleFilterBedRoom} />
                </div>
              </div>
              <div className="col-sm-2 col-bathroom">
                <div style={{ width: '100%' }} >
                  <SelectRoom placeholder="ห้องน้ำ" value={searchParameters.bathroom} onChange={this.handleFilterBathRoom} />
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
                          { /*<SpecialFeature
                            items={configRealestate.data.specialFeature}
                            defaultValue={defaultSelected.specialFeature}
                            onSelect={this.handleFilterSpecialFeature}
                          /> */ }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          </TabPane>
          <TabPane tab="ใกล้สถานีรถไฟฟ้า" key="transport">
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
              <div className="col-md-3">
                <div style={{ width: '100%' }}>
                  <SelectElectricTrain
                    value={searchParameters.electricTrain}
                    onChange={this.handleFilterElectricTrain}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ width: '100%' }}>
                  <SelectElectricTrainStation
                    value={searchParameters.location}
                    train={searchParameters.electricTrain}
                    onChange={this.handleFilterElectricTrainStation}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ width: '100%' }}>
                  <SelectRadius
                    value={searchParameters.radius}
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
                    value={searchParameters.for}
                    onChange={this.handleFilterFor}
                  />
                </div>
              </div>
              <div className="col-sm-2 col-bedroom">
                <div style={{ width: '100%' }} >
                  <SelectRoom placeholder="ห้องนอน" value={searchParameters.bedroom} onChange={this.handleFilterBedRoom} />
                </div>
              </div>
              <div className="col-sm-2 col-bathroom">
                <div style={{ width: '100%' }} >
                  <SelectRoom placeholder="ห้องน้ำ" value={searchParameters.bathroom} onChange={this.handleFilterBathRoom} />
                </div>
              </div>
              <div className="col-sm-3 col-price">
                <div style={{ width: '100%' }} >
                  <SelectPrice value={searchParameters.price} onChange={this.handleFilterPrice} />
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
                          { /*<SpecialFeature
                            items={configRealestate.data.specialFeature}
                            defaultValue={defaultSelected.specialFeature}
                            onSelect={this.handleFilterSpecialFeature}
                          /> */ }
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
    );
  }
});

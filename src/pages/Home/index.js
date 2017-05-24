import React, { Component } from 'react';
import { Tabs, Input, Select, Icon, Button, Slider } from 'antd';
import _ from 'lodash';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

import BannerRealEstate from '../../containers/BannerRealEstate';
import SpecialFeature from '../../containers/SpecialFeature';

import ButtonBuyRent from '../../components/ButtonBuyRent';
import RealEstateItem from '../../components/RealEstateItem';

import realEstateData from '../../../public/data/realEstateData.json';
import specialFeatureData from '../../../public/data/specialFeatureData.json';

class Home extends Component {

  state = {
    defaultValue: {
      price: {
        min: 0,
        max: 100000000,
      },
      realEstate: realEstateData,
    },
    filterValue: {
      type: 'rent', // buy, rent
      input: '',
      residentialType: '',
      price: {
        min: 0,
        max: 100000000,
      },
      room: {
        bedroom: '',
        bathroom: '',
      },
      specialFeature: specialFeatureData,
      realEstate: {},
      advanceExpand: false,
    },
    filter: false,
  }

  handleFilterType = (type) => {
    this.setState(prevState => ({
      filterValue: { ...prevState.filterValue, type: type },
    }));
  }

  handleFilterInput = (e) => {
    const input = e.target.value;
    this.setState(prevState => ({
      filterValue: { ...prevState.filterValue, input: `${input}` },
    }));
  }

  handleFilterResidentialType = (value) => {
    this.setState(prevState => ({
      filterValue: { ...prevState.filterValue, residentialType: value },
    }));
  }

  handleFilterAdvance = (e) => {
    this.setState(prevState => ({
      filterValue: { ...prevState.filterValue, advanceExpand: !prevState.filterValue.advanceExpand },
    }));
  }

  handleFilterPrice = (value) => {
    this.setState(prevState => ({
      filterValue: {
        ...prevState.filterValue, 
        price: {
          min: parseInt(value[0], 10),
          max: parseInt(value[1], 10),
        }
      },
    }));
  }

  handleFilterBedRoom = (value) => {
    this.setState(prevState => ({
      filterValue: {
        ...prevState.filterValue, 
        room: {
          ...prevState.filterValue.room,
          bedroom: value,
        }
      },
    }));
  }

  handleFilterBathRoom = (value) => {
    this.setState(prevState => ({
      filterValue: {
        ...prevState.filterValue, 
        room: {
          ...prevState.filterValue.room,
          bathroom: value,
        }
      },
    }));
  }

  handleFilterSpecialFeature = (data) => {
    this.setState(prevState => ({
      filterValue: { ...prevState.filterValue, specialFeature: data },
    }));
  }

  handleFilter = (value) => {
    const { defaultValue, filterValue } = this.state;

    // Filter Type
    let filterRealEstateData = _.filter(defaultValue.realEstate, ['type', filterValue.type === 'buy' ? 'sell' : filterValue.type]);
    
    // Filter Input
    if ( filterValue.input !== '' ) {
      filterRealEstateData = _.filter(filterRealEstateData, (data) => { 
        const stringToSearch = JSON.stringify(_.pick(data, ['project', 'address']));
        const regex = new RegExp(filterValue.input, "i");
        return regex.test(stringToSearch);
      });
    }

    // Filter PropertyType
    if ( filterValue.residentialType !== '' ) {
      filterRealEstateData = _.filter(filterRealEstateData, ['residentialType', filterValue.residentialType]);
    }

    // Filter Price
    filterRealEstateData = _.filter(filterRealEstateData, (data) => {
      return data.price >= filterValue.price.min && data.price <= filterValue.price.max;
    });

    // Filter BedRoom
    if ( filterValue.room.bedroom !== '' ) {
      filterRealEstateData = _.filter(filterRealEstateData, (data) => {
        return data.room.bedroom >= filterValue.room.bedroom;
      });
    }

    // Filter BathRoom
    if ( filterValue.room.bathroom !== '' ) {
      filterRealEstateData = _.filter(filterRealEstateData, (data) => {
        return data.room.bathroom >= filterValue.room.bathroom;
      });
    }

    // Filter SpecialFeature
    let filterSpecialFeature = false;

    _.forEach(filterValue.specialFeature, (value, key) => {
      _.forEach(value, (value2, key2) => {
        if ( value2 === 1 ) {
          filterSpecialFeature = true;
        }
      });
    });

    if ( filterSpecialFeature === true ) {
      filterRealEstateData = _.filter(filterRealEstateData, (data) => { 
        // const specialFeature = _.pick(data, ['specialFeature']);
        return true;
      });
    }
    
    this.setState(prevState => ({
      filter: true,
      filterValue: { ...prevState.filterValue, realEstate: filterRealEstateData },
    }));
  }

  render() {

    const { defaultValue, filterValue, filter } = this.state;

    const stepMarks = {
      0: {
        style: {
          color: '#484849',
        },
        label: '0 บ.',
      },
      100000000: {
        style: {
          color: '#484849',
        },
        label: '100 ล.บ.',
      },
    };

    const stepDefaultValue = [];
    stepDefaultValue.push(defaultValue.price.min);
    stepDefaultValue.push(defaultValue.price.max);

    return (
      <div id="Home">
      	<div className="row">
      		<div className="col-md-6 layout-left">
      			<BannerRealEstate />
      		</div>
      		<div className="col-md-6 col-md-offset-6 layout-right">
            <div className="filter_real_estate">
              <Tabs defaultActiveKey="1">
                <TabPane tab="เลือกจากทำเล" key="1">
                  <div className="form-inline">
                    <div className="form-group">
                      <ButtonBuyRent type={filterValue.type} onSelect={this.handleFilterType} />
                    </div>
                    <div className="form-group">
                      <Input placeholder="ค้นหา" style={{ width: 120 }} onChange={this.handleFilterInput} />
                    </div>
                    <div className="form-group">
                      <Select placeholder="ประเภทที่อยู่อาศัย" style={{ width: 150 }} onChange={this.handleFilterResidentialType} >
                        <Option value="condo">Condo</Option>
                        <Option value="house">House</Option>
                      </Select>
                    </div>
                    <div className="form-group">
                      <Button style={{ width: 150 }} className={"btn-filter_advance " + (filterValue.advanceExpand ? 'active' : '')} onClick={this.handleFilterAdvance}>
                        ตัวเลือกเพิ่มเติม <Icon type={filterValue.advanceExpand ? 'up' : 'down'} />
                      </Button>
                    </div>
                    <div className="form-group">
                      <Button type="primary" style={{ width: 80 }} onClick={this.handleFilter} >ค้นหา</Button>
                    </div>
                  </div>
                  {filterValue.advanceExpand === true &&
                    <div className="row">
                      <div className="col-md-12">
                        <div className="filter_advance">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="price_length">
                                <Slider range marks={stepMarks} defaultValue={stepDefaultValue} min={defaultValue.price.min} max={defaultValue.price.max} onChange={this.handleFilterPrice} />
                              </div>
                            </div>
                            <div className="col-md-6 room_count">
                              <div className="room_count">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div>จำนวนห้องนอน</div>
                                    <Select style={{ width: '100%' }} onChange={this.handleFilterBedRoom} placeholder="--">
                                      <Option value="1">1</Option>
                                      <Option value="2">2</Option>
                                    </Select>
                                  </div>
                                  <div className="col-md-6">
                                    <div>จำนวนห้องน้ำ</div>
                                    <Select style={{ width: '100%' }} onChange={this.handleFilterBathRoom} placeholder="--">
                                      <Option value="1">1</Option>
                                      <Option value="2">2</Option>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className="property_block">
                                <SpecialFeature items={filterValue.specialFeature} onSelect={this.handleFilterSpecialFeature} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </TabPane>
                <TabPane tab="ใกล้สถานีรถไฟฟ้า" key="2">Content of Tab Pane 2</TabPane>
                <TabPane tab="ชื่อโครงการ" key="3">Content of Tab Pane 3</TabPane>
              </Tabs>
            </div>
            <hr />
            {filter === true ? (
              <div className="result">
                <div className="list">
                  <h3>{filterValue.realEstate.length} ผลการค้นหา</h3>
                  <div>
                    {
                      _.map(filterValue.realEstate, (item, key) => {
                        return (
                          <div className="col-md-4"><RealEstateItem item={item} type="sell" /></div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            ) : (
              <div className="main">
                <div className="list">
                  <h3>คอนโด</h3>
                  <div className="row">
                    <div className="col-md-4"><RealEstateItem item={defaultValue.realEstate[0]} type="sell" /></div>
                    <div className="col-md-4"><RealEstateItem item={defaultValue.realEstate[1]} type="banner" /></div>
                    <div className="col-md-4"><RealEstateItem item={defaultValue.realEstate[2]} type="sell" /></div>
                  </div>
                  <div className="row">
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[3]} type="sell" /></div>
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[4]} type="sell" /></div>
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[5]} type="sell" /></div>
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[7]} type="banner" /></div>
                  </div>
                </div>
                <div className="list">
                  <h3>บ้าน</h3>
                  <div className="row">
                    <div className="col-md-6"><RealEstateItem item={defaultValue.realEstate[8]} type="banner" /></div>
                    <div className="col-md-6"><RealEstateItem item={defaultValue.realEstate[9]} type="sell" /></div>
                  </div>
                  <div className="row">
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[10]} type="sell" /></div>
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[11]} type="sell" /></div>
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[12]} type="sell" /></div>
                    <div className="col-md-3"><RealEstateItem item={defaultValue.realEstate[13]} type="sell" /></div>
                  </div>
                </div>
                <div className="list news">
                  <h3>ข่าวสารและบทความ</h3>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4"></div>
                    <div className="col-md-4"></div>
                  </div>
                </div>
              </div>
            )}
      		</div>
      	</div>
      </div>
    );
  }
}

export default Home;

import React, { Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { Input, Select, Icon, Popover, Col, Row } from 'antd';

import InputPriceRange from '../InputPriceRange';
import InputAreaSearch from '../InputAreaSearch';
import 'react-select/dist/react-select.css';

const InputGroup = Input.Group;
const Option = Select.Option;

const priceListSale = [
  500000, 1000000, 1500000, 2000000, 2500000,
  3000000, 3500000, 4000000, 4500000, 5000000,
  5500000, 6000000, 6500000, 7000000, 7500000,
  8000000, 8500000, 9000000, 9500000, 10000000,
  11000000, 12000000, 13000000, 14000000,
  15000000, 20000000, 50000000];

const priceListRent = [0, 2000, 4000, 6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000];


const PropertySearchWrapper = styled.div`
  padding: 15px;
`;

const ListHeader = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const LocationPopover = styled.div`
  width: 600px;
`;

const propertyTypes = ['Condominium', 'Town-home', 'House', 'Commercial Space', 'Land'];

const content = (
  <LocationPopover>
    <Row>
      <Col span={6}>
        <ListHeader>ทำเล</ListHeader>
        <ul>
          <li><a href="#">บางลำภู</a></li>
        </ul>
      </Col>
      <Col span={12}>
        <ListHeader>รถไฟฟ้า</ListHeader>
        <ul>
          <li><a href="#">หมอชิต</a></li>
          <li><a href="#">สนามเป้า</a></li>
        </ul>
      </Col>
      <Col span={6}>
        <ListHeader>รถใต้ดิน</ListHeader>
        <ul>
          <li><a href="#">ลาดพร้าว</a></li>
        </ul>
      </Col>
    </Row>
  </LocationPopover>
);

class PropertySearch extends Component {

  static defaultProps = {
    searchParameters: {},
    areaDataSource: [],
  }

  onUpdateSearchParameters = (searchParameters) => {
    this.props.onUpdate(searchParameters);
  }

  handleSelectArea = (option) => {
    console.log('handleSelectArea', option);
    const searchParameters = _.clone(this.props.searchParameters);
    searchParameters.area = {
      name: option !== null ? option.value : '',
      bound: { sw: undefined, ne: undefined },
    }
    this.onUpdateSearchParameters(searchParameters);
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
    this.onUpdateSearchParameters(searchParameters);
  }

  render() {
    const { searchParameters, areas } = this.props;
    // const locationInputSuffix = (
    //   <Popover content={content} placement="bottomRight" trigger="click"><Icon type="bars" /></Popover>
    // );
    return (
      <PropertySearchWrapper>
        <div>
          <InputGroup compact>
            <Select
              style={{ width: '20%' }}
              defaultValue="sale"
              onChange={value => this.onUpdateSearchParameters({ ...searchParameters, for: value })}
            >
              <Option value="sale">ขาย</Option>
              <Option value="rent">เช่า</Option>
            </Select>
            <Select
              prefix={<Icon type="notification" />}
              style={{ width: '30%' }}
              defaultValue="Condominium"
              onChange={value => this.onUpdateSearchParameters({ ...searchParameters, propertyType: value })}
            >
              {_.map(propertyTypes, type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
            <div style={{ width: '50%' }}>
              <InputAreaSearch
                value={_.find(areas, a => searchParameters.area.name === a.value)}
                options={areas}
                onChange={this.handleSelectArea}
              />
            </div>
          </InputGroup>
        </div>
        <div>
          <Row>
            <Col span={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="ห้องนอน"
                onChange={value => this.onUpdateSearchParameters({ ...searchParameters, bedroom: value })}
              >
                {_.map(_.range(1, 6), num => <Option value={`${num}`}>{num} ห้องนอน</Option>)}
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="ห้องน้ำ"
                onChange={value => this.onUpdateSearchParameters({ ...searchParameters, bathroom: value })}
              >
                {_.map(_.range(1, 6), num => <Option value={`${num}`}>{num} ห้องน้ำ</Option>)}
              </Select>
            </Col>
            <Col span={8}>
              <InputPriceRange
                priceList={searchParameters.for === 'sale' ? priceListSale : priceListRent}
                value={searchParameters.price}
                onChange={this.handleFilterPrice}
              />
            </Col>
          </Row>
        </div>
      </PropertySearchWrapper>
    );
  }
}

export default PropertySearch;

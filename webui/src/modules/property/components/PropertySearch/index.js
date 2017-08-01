import React, { Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { Input, Select, Icon, Col, Row } from 'antd';

import { connect } from 'react-redux';

import InputPriceRange from '../InputPriceRange';
import InputAreaSearch from '../InputAreaSearch';

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

const propertyTypes = ['Condominium', 'Town-home', 'House', 'Commercial Space', 'Land'];

const mapStateToProps = (state) => {
  const areas = _.map(_.get(state, 'entities.areas.entities'), (area, slug) => {
    return {
      ...area,
      label: _.get(area, 'title.th'),
      value: slug,
    };
  });

  return {
    areas,
  };
};

export default connect(mapStateToProps)(
class PropertySearch extends Component {

  static propTypes = {
    areas: T.arrayOf(T.shape({
      label: T.string,
      value: T.string,
    })),
  }

  static defaultProps = {
    searchParameters: {},
    areas: [],
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
    return (
      <PropertySearchWrapper>
        <div>
          <InputGroup>
            <Row gutter={8}>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="ประเภทประกาศ"
                  onChange={value => this.onUpdateSearchParameters({ ...searchParameters, for: value })}
                >
                  <Option value="sale">ขาย</Option>
                  <Option value="rent">เช่า</Option>
                </Select>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Select
                  prefix={<Icon type="notification" />}
                  style={{ width: '100%' }}
                  placeholder="ประเภทอสังหาฯ"
                  onChange={value => this.onUpdateSearchParameters({ ...searchParameters, propertyType: value })}
                >
                  {_.map(propertyTypes, type => <Option key={type} value={type}>{type}</Option>)}
                </Select>
              </Col>
              <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                <div style={{ width: '100%' }}>
                  <InputAreaSearch
                    value={_.find(areas, a => searchParameters.area.name === a.value)}
                    options={areas}
                    onChange={this.handleSelectArea}
                  />
                </div>
              </Col>
            </Row>
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
                {_.map(_.range(1, 6), num => <Option key={`${num}-bedroom`} value={`${num}`}>{num} ห้องนอน</Option>)}
              </Select>
            </Col>
            <Col span={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="ห้องน้ำ"
                onChange={value => this.onUpdateSearchParameters({ ...searchParameters, bathroom: value })}
              >
                {_.map(_.range(1, 6), num => <Option key={`${num}-bathroom`} value={`${num}`}>{num} ห้องน้ำ</Option>)}
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
});

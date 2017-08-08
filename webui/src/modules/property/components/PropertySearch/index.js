import React, { Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { Input, Select, Icon, Col, Row } from 'antd';

import { connect } from 'react-redux';

import InputPriceRange from '../InputPriceRange';
import InputAreaSearch from '../InputAreaSearch';

const Option = Select.Option;

const priceListSale = [
  500000, 1000000, 1500000, 2000000, 2500000,
  3000000, 3500000, 4000000, 4500000, 5000000,
  5500000, 6000000, 6500000, 7000000, 7500000,
  8000000, 8500000, 9000000, 9500000, 10000000,
  11000000, 12000000, 13000000, 14000000,
  15000000, 20000000, 50000000];

const priceListRent = [0, 2000, 4000, 6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000, 50000, 60000];

const BREAKPOINT = 768;
const PropertySearchWrapper = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eeeeee;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAKPOINT}px) {
    flex-direction: row;
    margin: 0 -6px;
  }
`;

const InputWrapper = styled.div`
  padding: 6px;
  flex-grow: 0;
  width: 100%;

  @media (min-width: ${BREAKPOINT}px) {
    flex-grow: 1;
    padding: 0 6px;
  }
`;

const SummaryInput = styled.div`
  background-color: #787878;
  color: white;
  text-align: center;
  border-radius: 4px;
  height: 37px;
  line-height: 37px;
  cursor: pointer;

  &:hover {
    background: #999999;
  }
`;

const Color = require('color');

const bgColor = Color.rgb(135, 183, 64);
const hoverColor = bgColor.lighten(0.1);
const activeColor = bgColor.darken(0.15);
const bgColorStr = bgColor.string();


const ButtonPrimary = styled.button`
  background: ${bgColorStr};
  background: -moz-linear-gradient(top, ${bgColorStr} 0%, rgba(125,170,59,1) 100%);
  background: -webkit-gradient(left top, left bottom, color-stop(0%, ${bgColorStr}), color-stop(100%, rgba(125,170,59,1)));
  background: -webkit-linear-gradient(top, ${bgColorStr} 0%, rgba(125,170,59,1) 100%);
  background: -o-linear-gradient(top, ${bgColorStr} 0%, rgba(125,170,59,1) 100%);
  background: -ms-linear-gradient(top, ${bgColorStr} 0%, rgba(125,170,59,1) 100%);
  background: linear-gradient(to bottom, ${bgColorStr} 0%, rgba(125,170,59,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#87b740', endColorstr='#7daa3b', GradientType=0 );
  border: none;
  color: #ffffff;
  font-size: 16px;
  height: 37px;
  padding: 3px 24px;
  border-radius: 3px;
  cursor: pointer;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: 0 2px 0 #5e7f2c, 1px 2px 3px rgba(0, 0, 0, 0.25);
  box-shadow: 0 2px 0 #5e7f2c, 1px 2px 3px rgba(0, 0, 0, 0.25);
  outline: none;
  width: 100%;

  &:hover {
    background: ${hoverColor.string()};
  }

  &:active {
    background: ${activeColor.string()};
  }

  @media (min-width: ${BREAKPOINT}px) {
    width: auto;
  }
`;

const propertyTypes = [
  { value: 'condominium', label: 'Condominium' },
  { value: 'town-home', label: 'Town-home' },
  { value: 'house', label: 'House' },
  { value: 'commercial-space', label: 'Commercial Space' },
  { value: 'land', label: 'Land' },
];

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
      simpleMode: T.bool,
      showSearchButton: T.bool,
      trigger: T.string,
      onUpdate: T.func,
    }

    static defaultProps = {
      searchParameters: {
        for: 'all',
        propertyType: 'all',
        area: {
          name: 'bangkok',
        },
      },
      areas: [],
      simpleMode: false,
      showSearchButton: true,
      trigger: 'change',
      onUpdate: () => {},
    }

    constructor(props) {
      super(props);
      this.state = {
        showSummaryOnly: true,
        mobileView: false,
        searchParameters: props.searchParameters,
      }
    }

    componentWillReceiveProps = (nextProps) => {
      if (!_.isEqual(nextProps.searchParameters, this.props.searchParameters)) {
        this.setState({
          searchParameters: nextProps.searchParameters,
        });
      }
    }

    componentWillMount() {
      this.handleResize();
    }

    handleResize = () => {
      const mobileView = !window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
      if (mobileView !== this.state.mobileView) {
        this.setState({
          mobileView,
        });
      }
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    onUpdateSearchParameters = (newParam) => {
      const searchParameters = this.state.searchParameters;
      const updateParameters = { ...searchParameters, ...newParam };
      console.log('onUpdateSearchParameters', newParam, updateParameters);
      this.setState({
        searchParameters: updateParameters,
      });

      if (this.props.trigger === 'change') this.props.onUpdate(updateParameters);
    }

    handleSubmit = (e) => {
      console.log('handleSubmit');
      // const searchParameters = _.clone(this.props.searchParameters);
      const { searchParameters } = this.state;

      this.setState({
        showSummaryOnly: true,
      });

      console.log('searchParameters', searchParameters);

      this.props.onSubmit(searchParameters);
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

      const searchParameters = this.state.searchParameters;

      const updateParam = {};
      if (key === 'priceMin') {
        updateParam.price = {
          ...searchParameters.price,
          min: _.toNumber(value),
        };
      }
      if (key === 'priceMax') {
        updateParam.price = {
          ...searchParameters.price,
          max: _.toNumber(value),
        };
      }
      this.onUpdateSearchParameters(updateParam);
    }

    expandView = () => {
      this.setState({
        showSummaryOnly: false,
      });
    }

    render() {
      const { areas, simpleMode, showSearchButton } = this.props;
      const { searchParameters } = this.state;

      console.log('searchParameters', searchParameters);
      let priceField;
      let bedroomField;
      let bathroomField;

      if (!simpleMode) {
        bedroomField = (
          <InputWrapper>
            <Select
              style={{ width: '100%' }}
              placeholder="ห้องนอน"
              value={searchParameters.bedroom}
              onChange={value => this.onUpdateSearchParameters({ ...searchParameters, bedroom: value })}
            >
              {_.map(_.range(1, 6), num => <Option key={`${num}-bedroom`} value={num}>{num} ห้องนอน</Option>)}
            </Select>
          </InputWrapper>
        );

        bathroomField = (
          <InputWrapper>
            <Select
              style={{ width: '100%' }}
              placeholder="ห้องน้ำ"
              value={searchParameters.bathroom}
              onChange={value => this.onUpdateSearchParameters({ ...searchParameters, bathroom: value })}
            >
              {_.map(_.range(1, 6), num => <Option key={`${num}-bathroom`} value={num}>{num} ห้องน้ำ</Option>)}
            </Select>
          </InputWrapper>
        );

        priceField = (
          <InputWrapper>
            <InputPriceRange
              value={{
                min: _.get(searchParameters, 'price.min'),
                max: _.get(searchParameters, 'price.max'),
              }}
              priceList={searchParameters.for === 'sale' ? priceListSale : priceListRent}
              onChange={this.handleFilterPrice}
            />
          </InputWrapper>
        );
      }

      const forValue = _.includes(['sale', 'rent'], searchParameters.for) ? searchParameters.for : [];
      const propertyTypeValue = _.includes(['condominium', 'town-home', 'house', 'commercial-space', 'land'], _.get(searchParameters, 'propertyType.0')) ? _.get(searchParameters, 'propertyType.0') : [];
      let content = (
        <SearchBarWrapper>
          <InputWrapper>
            <Select
              style={{ width: '100%' }}
              placeholder="ประเภทประกาศ"
              defaultValue={forValue}
              onChange={value => this.onUpdateSearchParameters({ ...searchParameters, for: _.toLower(value) })}
            >
              <Option value="sale">ขาย</Option>
              <Option value="rent">เช่า</Option>
            </Select>
          </InputWrapper>
          <InputWrapper>
            <Select
              style={{ width: '100%' }}
              placeholder="ประเภทอสังหาฯ"
              defaultValue={propertyTypeValue}
              onChange={value => this.onUpdateSearchParameters({ ...searchParameters, propertyType: _.toLower(value) })}
            >
              {_.map(propertyTypes, type => <Option key={type.value} value={type.value}>{type.label}</Option>)}
            </Select>
          </InputWrapper>
          <InputWrapper>
            <InputAreaSearch
              value={_.find(areas, a => searchParameters.area.name === a.value)}
              options={areas}
              onChange={this.handleSelectArea}
            />
          </InputWrapper>
          {priceField}
          {bedroomField}
          {bathroomField}
          {
            showSearchButton &&
              <InputWrapper>
                <ButtonPrimary onClick={this.handleSubmit}>ค้นหา</ButtonPrimary>
              </InputWrapper>
          }
        </SearchBarWrapper>
      );

      if (this.state.mobileView && this.state.showSummaryOnly) {
        content = (
          <SearchBarWrapper>
            <InputWrapper>
              <SummaryInput onClick={this.expandView}>
                {_.upperFirst(searchParameters.propertyType)} &#8729; for {searchParameters.for} &#8729; {_.upperFirst(searchParameters.area.name)}
              </SummaryInput>
            </InputWrapper>
          </SearchBarWrapper>
        );
      }

      return (
        <PropertySearchWrapper>
          {content}
        </PropertySearchWrapper>
      );
    }
  }
);

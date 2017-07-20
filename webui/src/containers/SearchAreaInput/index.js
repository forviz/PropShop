import React, { Component } from 'react';
import _ from 'lodash';
import { Input, Icon, AutoComplete } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';

const { Option, OptGroup } = AutoComplete;

const PropertyDetail = styled.span`
  position: absolute;
  right: 16px;
  color: #88b840;
`;


const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(
  class SearchInput extends Component {

    handleSelect = (value, option) => {
      this.props.onSelect({ value, key: option.props.key, location: option.props.location });
      // this.props.onChange(value);
    }

    handleFilter = (inputValue, option) => {
      return option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    }

    render() {
      const { value, placeholder, dataSource } = this.props;

      const options = dataSource.map(group => (
        <OptGroup
          key={group.title}
          label={group.title}
        >
          {group.children.map(opt => (
            <Option key={opt.key} value={opt.key} location={opt.location}>
              {_.isString(opt.title) ? opt.title : _.get(opt, 'title.th') }
              <PropertyDetail>{group.title}</PropertyDetail>
            </Option>
          ))}
        </OptGroup>
      ));

      return (
        <div className="certain-category-search-wrapper" style={{ width: '100%', height: 38 }}>
          <AutoComplete
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 300, padding: 10 }}
            size="large"
            style={{ width: '100%' }}
            value={value}
            dataSource={options}
            placeholder={placeholder}
            optionLabelProp="value"
            filterOption={this.handleFilter}
            onSelect={this.handleSelect}
          >
            <Input size="large" suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
        </div>
      );
    }
  },
);

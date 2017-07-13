import React, { Component } from 'react';
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
  return {
    dataSource: [
      {
        title: 'Neighborhood',
        children: [
          { title: 'Bangkok' },
          { title: 'Chiangmai' },
        ]
      },
      {
        title: 'Condominium',
        children: [
          { title: 'The Base Onnut 77' },
          { title: 'IDEO VERVE' },
        ]
      },
      {
        title: 'BTS Station',
        children: [
          { title: 'BTS จตุจักร' },
          { title: 'BTS สะพานควาย' },
        ]
      }
    ],
  }
}

export default connect(mapStateToProps)(
  class SearchInput extends Component {

    handleSearch = (value) => {
      console.log(value);
    }

    handleFilter = (inputValue, option) => {
      return option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    }

    render() {
      const { placeholder, dataSource } = this.props;

      const options = dataSource.map(group => (
        <OptGroup
          key={group.title}
          label={group.title}
        >
          {group.children.map(opt => (
            <Option key={opt.title} value={opt.title}>
              {opt.title}
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
            dataSource={options}
            placeholder={placeholder}
            optionLabelProp="value"
            filterOption={this.handleFilter}
            onChange={value => this.props.onChange(value)}
          >
            <Input size="large" suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
        </div>
      );
    }
  },
);

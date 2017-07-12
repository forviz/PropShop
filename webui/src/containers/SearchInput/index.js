import React, { Component } from 'react';
import { Input, Icon, AutoComplete } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const { Option, OptGroup } = AutoComplete;

const StyledAutoComplete = styled(AutoComplete)`
  background: white;

  .certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {
    color: red;
    font-weight: bold;
  }
`;

const PropertyDetail = styled.span`
  position: absolute;
  color: #999;
  right: 16px;

  span {
    color: #88b840;
  }
`;


const mapStateToProps = (state) => {
  return {
    dataSource: [
      {
        title: 'Province',
        children: [
          { title: 'Bangkok', count: 680 },
          { title: 'Chiangmai', count: 73 },
        ]
      },
      {
        title: 'Condominium',
        children: [
          { title: 'The Base Onnut 77', count: 16 },
          { title: 'IDEO VERVE', count: 5 },
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
              <PropertyDetail><span>{opt.count}</span> properties</PropertyDetail>
            </Option>
          ))}
        </OptGroup>
      ));

      return (
        <div className="certain-category-search-wrapper" style={{ width: 250 }}>
          <AutoComplete
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 300 }}
            size="large"
            style={{ width: '100%' }}
            dataSource={options}
            placeholder={placeholder}
            optionLabelProp="value"
            filterOption={this.handleFilter}
          >
            <Input size="large" suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
        </div>
      );
    }
  },
);

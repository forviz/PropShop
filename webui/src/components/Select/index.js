import React, { Component } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
const Option = Select.Option;

class SelectComponent extends Component {

  static defaultProps = {
    items: [],
    placeholder: [],
    defaultValue: [],
    value: '',
  }

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  render() {

    const { items, placeholder, defaultValue, value } = this.props;

    const itemsOption = _.map(items, (item, index) => {
      return (
        <Option key={index} value={item}>{item}</Option>
      );
    })

    return (
      <div className="Select">
        {value !== '' ? (
          <Select placeholder={placeholder} defaultValue={defaultValue} value={value} style={{ width: '100%' }} onChange={this.handleOnChange} >
            {itemsOption}
          </Select>
        ) : (
          <Select placeholder={placeholder} defaultValue={defaultValue} style={{ width: '100%' }} onChange={this.handleOnChange} >
            {itemsOption}
          </Select>
        )}
      </div>
    );
  }
}

export default SelectComponent;
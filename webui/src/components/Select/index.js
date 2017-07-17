import React, { Component } from 'react';
import _ from 'lodash';
import { Select } from 'antd';

const Option = Select.Option;

class SelectComponent extends Component {

  static defaultProps = {
    items: [],
    placeholder: '',
    value: '',
  }

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { items, placeholder, value } = this.props;

    let itemsOption = null;
    if (items) {
      itemsOption = _.map(items, (item, index) => {
        return (
          <Option key={index} value={item}>{item}</Option>
        );
      });
    }

    const className = _.size(value) === 0 ? '' : 'active';

    return (
      <div className={`Select ${className}`}>
        <Select placeholder={placeholder} value={value} style={{ width: '100%' }} onChange={this.handleOnChange} >
          {itemsOption}
        </Select>
      </div>
    );
  }
}

export default SelectComponent;

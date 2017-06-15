import React, { Component } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
const Option = Select.Option;
import SelectComponent from '../Select';

class SelectSellType extends Component {

  static defaultProps = {
    items: ['ขาย','เช่า','ขายใบจอง','ขายดาวน์','ขายหลังโอนกรรมสิทธิ์','ยูนิตของโครงการโดยตรง','ขายเท่าทุ่น','ขายขาดทุน'],
    placeholder: [],
    defaultValue: [],
    value: '',
  }

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { items, placeholder, defaultValue, value } = this.props;
    return (
      <SelectComponent items={items} placeholder={placeholder} defaultValue={defaultValue} value={value} onChange={this.handleOnChange} />
    );
  }
}

export default SelectSellType;
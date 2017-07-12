import React, { Component } from 'react';
import SelectComponent from '../Select';

class SelectSellType extends Component {

  static defaultProps = {
    type: 'seller',
    items: {
      buyer: ['ซื้อ', 'เช่า', 'ขายใบจอง', 'ขายดาวน์', 'ขายหลังโอนกรรมสิทธิ์', 'ยูนิตของโครงการโดยตรง', 'ขายเท่าทุ่น', 'ขายขาดทุน'],
      seller: ['ขาย', 'เช่า', 'ขายใบจอง', 'ขายดาวน์', 'ขายหลังโอนกรรมสิทธิ์', 'ยูนิตของโครงการโดยตรง', 'ขายเท่าทุ่น', 'ขายขาดทุน'],
    },
    placeholder: [],
    value: [],
  }

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { type, items, placeholder, value } = this.props;

    return (
      <SelectComponent
        items={items[type]}
        placeholder={placeholder}
        value={value}
        onChange={this.handleOnChange}
      />
    );
  }
}

export default SelectSellType;

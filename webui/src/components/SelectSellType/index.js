import React, { Component } from 'react';
import SelectComponent from '../Select';

class SelectSellType extends Component {

  static defaultProps = {
    type: 'seller',
    items: {
      buyer: [{ title: 'ขาย', value: 'sale' }, { title: 'เช่า', value: 'rent' }],
      // seller: ['ขาย', 'เช่า', 'ขายใบจอง', 'ขายดาวน์', 'ขายหลังโอนกรรมสิทธิ์', 'ยูนิตของโครงการโดยตรง', 'ขายเท่าทุ่น', 'ขายขาดทุน'],
    },
    placeholder: [],
    value: 'sale',
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

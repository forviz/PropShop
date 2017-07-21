import React, { Component } from 'react';
import T from 'prop-types';
import SelectComponent from '../Select';

class SelectSellType extends Component {

  static propTypes = {
    type: T.string.isRequired,
    items: T.shape().isRequired,
    placeholder: T.string,
    value: T.string.isRequired,
    onChange: T.func.isRequired,
  }

  static defaultProps = {
    type: 'seller',
    items: {
      buyer: ['ซื้อ', 'เช่า'],
      seller: ['ขาย', 'เช่า'],
    },
    placeholder: [],
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

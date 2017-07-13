import React, { Component } from 'react';
import SelectComponent from '../Select';

class SelectResidentialType extends Component {

  static defaultProps = {
    items: ['Condominium', 'Town-home', 'House', 'Commercial Space', 'Land'],
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

export default SelectResidentialType;

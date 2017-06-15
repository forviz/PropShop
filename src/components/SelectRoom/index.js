import React, { Component } from 'react';
import _ from 'lodash';
import { Select } from 'antd';
const Option = Select.Option;

class SelectRoom extends Component {

  static defaultProps = {
    maxRoom: 5,
    placeholder: [],
    defaultValue: [],
    value: '',
  }

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  renderRoom = (maxRoom) => {
    const object = [];
    let value;
    for (let i = 0; i < parseInt(maxRoom, 10); i++) {
      value = (i+1).toString();
      object.push(<Option key={i} value={value}>{value}</Option>);
    }
    return object;
  }

  render() {
    const { maxRoom, placeholder, defaultValue, value } = this.props;
    return (
      <div className="SelectRoom">
        {value !== '' ? (
          <Select placeholder={placeholder} defaultValue={defaultValue} value={value} style={{ width: '100%' }} onChange={this.handleOnChange} >
            {this.renderRoom(maxRoom)}
          </Select>
        ) : (
          <Select placeholder={placeholder} defaultValue={defaultValue} style={{ width: '100%' }} onChange={this.handleOnChange} >
            {this.renderRoom(maxRoom)}
          </Select>
        )}
      </div>
    );
  }
}

export default SelectRoom;
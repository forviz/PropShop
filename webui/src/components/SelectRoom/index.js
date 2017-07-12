import React, { Component } from 'react';
import { Select } from 'antd';
import _ from 'lodash';

const Option = Select.Option;

class SelectRoom extends Component {

  static defaultProps = {
    maxRoom: 5,
    placeholder: [],
    value: [],
  }

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  renderRoom = (maxRoom) => {
    const object = [];
    let value;
    for (let i = 0; i < parseInt(maxRoom, 10); i += 1) {
      value = (i + 1).toString();
      object.push(<Option key={i} value={value}>{value} {this.props.placeholder}</Option>);
    }
    return object;
  }

  render() {
    const { maxRoom, placeholder, value } = this.props;
    const active = _.size(value) === 0 ? '' : 'active';
    return (
      <div className={`SelectRoom ${active}`}>
        <Select placeholder={placeholder} value={value} style={{ width: '100%' }} onChange={this.handleOnChange} >
          {this.renderRoom(maxRoom)}
        </Select>
      </div>
    );
  }
}

export default SelectRoom;

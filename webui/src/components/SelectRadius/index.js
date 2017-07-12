import React, { Component } from 'react';
import { Select } from 'antd';
import _ from 'lodash';

const Option = Select.Option;

class SelectRadius extends Component {

  getRadius = (limit) => {
    const data = [];
    for (let i = 1; i <= limit; i += 1) {
      data.push(<Option key={i.toString()} value={i.toString()}>ไม่เกิน {i.toString()} กม.</Option>);
    }
    return data;
  }

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { value } = this.props;
    const disabled = _.size(value) === 0 ? true : false;
    const active = _.size(value) === 0 ? '' : 'active';
    return (
      <div className={`SelectRadius ${active}`}>
        <Select placeholder="รัศมีการเดินทาง" disabled={disabled} style={{ width: '100%' }} value={value} onChange={this.handleOnChange} >
          {this.getRadius(10)}
        </Select>
      </div>
    );
  }
}

export default SelectRadius;

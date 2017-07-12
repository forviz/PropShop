import React, { Component } from 'react';
import { Select } from 'antd';
import _ from 'lodash';

const Option = Select.Option;

class SelectElectricTrain extends Component {

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { value } = this.props;
    const active = _.size(value) === 0 ? '' : 'active';
    return (
      <div className={`SelectElectricTrain ${active}`}>
        <Select placeholder="ประเภทรถไฟฟ้า" style={{ width: '100%' }} value={value} onChange={this.handleOnChange} >
          <Option value="bts">รถไฟฟ้า BTS</Option>
          <Option value="mrt">รถไฟฟ้า MRT</Option>
          <Option value="brt">รถไฟฟ้า BRT</Option>
        </Select>
      </div>
    );
  }
}

export default SelectElectricTrain;

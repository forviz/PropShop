import React, { Component } from 'react';
import { Select } from 'antd';
import _ from 'lodash';

import BTSStationJSON from '../../../public/data/BTSStation.json';
import MRTStationJSON from '../../../public/data/MRTStation.json';
import BRTStationJSON from '../../../public/data/BRTStation.json';

const electricTrainStation = {
  bts: BTSStationJSON,
  mrt: MRTStationJSON,
  brt: BRTStationJSON,
};

const Option = Select.Option;

class SelectElectricTrainStation extends Component {

  handleOnChange = (value) => {
    this.props.onChange(value);
  }

  getStation = (disabled) => {
    const { train } = this.props;
    if (disabled === false) {
      return _.map(electricTrainStation[train], (station) => {
        return <Option value={station.Position}>{station.StationNameTH}</Option>;
      });
    }
    return [];
  }

  render() {
    const { train } = this.props;
    let { value } = this.props;
    const disabled = _.size(train) === 0 ? true : false;
    const active = _.size(value) === 0 ? '' : 'active';
    value = disabled === true ? [] : value;
    return (
      <div className={`SelectElectricTrainStation ${active}`}>
        <Select placeholder="สถานีรถไฟฟ้า" disabled={disabled} style={{ width: '100%' }} value={value} onChange={this.handleOnChange} >
          {this.getStation(disabled)}
        </Select>
      </div>
    );
  }
}

export default SelectElectricTrainStation;

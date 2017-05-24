import React, { Component } from 'react';
import _ from 'lodash';
import { Checkbox } from 'antd';

const CheckboxGroup = Checkbox.Group;

class SpecialFeature extends Component {

  state = {
    checkAll: false,
  }

  onPropertyViewChange = (checkedValues) => {
    this.setItemsData('view', this.props.items.view, checkedValues);
  }

  onPropertyFacilitiesChange = (checkedValues) => {
    this.setItemsData('facilities', this.props.items.facilities, checkedValues);
  }
 
  onPropertyNearbyPlacesChange = (checkedValues) => {
    this.setItemsData('nearbyPlaces', this.props.items.nearbyPlaces, checkedValues);
  }

  onPropertyPrivateChange = (checkedValues) => {
    this.setItemsData('private', this.props.items.private, checkedValues);
  }

  setItemsData = (label, item, checkedValues) => {
    _.forEach(item, (value, key) => {
      if ( _.includes(checkedValues, key) ) {
        item[key] = 1;
      } else {
        item[key] = 0;
      }
    });
    this.props.items[label] = item;
    this.props.onSelect(this.props.items);
  }

  handleCheckAll = () => {
    const { checkAll } = this.state;
    checkAll === false ? this.checkAll() : this.cancelCheckAll();
  }

  checkAll = () => {
    const { items } = this.props;

    _.forEach(items, (value, key) => {
      _.forEach(value, (value2, key2) => {
        items[key][key2] = 1;
      });
    });

    this.setState(prevState => ({
      checkAll: true,
    }));

    this.props.onSelect(items);
  }

  cancelCheckAll = () => {
    const { items } = this.props;

    _.forEach(items, (value, key) => {
      _.forEach(value, (value2, key2) => {
        items[key][key2] = 0;
      });
    });

    this.setState(prevState => ({
      checkAll: false,
    }));

    this.props.onSelect(items);
  }

  render() {

    const { items } = this.props;

    const dataOptions = {};
    const dataValue = {};

    _.forEach(items, (value, key) => {
      const forOptions = [];
      const forValue = [];
      _.forEach(value, (value2, key2) => {
        forOptions.push(key2);
        if (value2 === 1) {
          forValue.push(key2);
        }
      });
      dataOptions[key] = forOptions;
      dataValue[key] = forValue;
    });

    return (
      <div className="SpecialFeature">
        <div className="head">
          <div className="clearfix">
            <div className="pull-left">
              <h4>คุณสมบัติพิเศษ</h4>
            </div>
            <div className="pull-right">
              <Checkbox checked={this.state.checkAll} onChange={this.handleCheckAll}>เลือกทั้งหมด</Checkbox>
            </div>
          </div>
        </div>
        <div className="list">
          <div className="row">
            <div className="col-md-3">
              <div className="title">ประเภทวิว</div>
              <div className="filter">
                <CheckboxGroup options={dataOptions.view} value={dataValue.view} onChange={this.onPropertyViewChange} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="title">สิ่งอำนวยความสะดวก</div>
              <div className="filter">
                <CheckboxGroup options={dataOptions.facilities} value={dataValue.facilities} onChange={this.onPropertyFacilitiesChange} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="title">สถานที่ใกล้เคียง</div>
              <div className="filter">
                <CheckboxGroup options={dataOptions.nearbyPlaces} value={dataValue.nearbyPlaces} onChange={this.onPropertyNearbyPlacesChange} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="title">ส่วนตัว</div>
              <div className="filter">
                <CheckboxGroup options={dataOptions.private} value={dataValue.private} onChange={this.onPropertyPrivateChange} />
              </div>
            </div>
          </div>
        </div>
        <div className="foot">
          <div className="clearfix">
            <div className="pull-left">
              <span className="remark">*สามารถเลือกได้หลายข้อ</span>
            </div>
            <div className="pull-right">
              <a onClick={this.cancelCheckAll}><b className="text-green">ยกเลิกทั้งหมด</b></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SpecialFeature;
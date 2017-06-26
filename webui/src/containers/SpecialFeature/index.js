import React, { Component } from 'react';
import _ from 'lodash';
import { Checkbox, Button } from 'antd';

const CheckboxGroup = Checkbox.Group;

class SpecialFeature extends Component {

  constructor(props) {
    super(props);
    if ( Object.keys(props.defaultValue).length > 0 ) {
      this.state.selected = props.defaultValue;
    }
  }

  static defaultProps = {
    items: {},
    defaultValue: {
      specialFeatureView: [],
      specialFeatureFacilities: [],
      specialFeatureNearbyPlaces: [],
      specialFeaturePrivate: [],
    }
  }

  state = {
    checkAll: false,
    selected: {
      specialFeatureView: [],
      specialFeatureFacilities: [],
      specialFeatureNearbyPlaces: [],
      specialFeaturePrivate: [],
    }
  }

  onSpecialFeatureViewChange = (checkedValues) => {
    this.setSelected('specialFeatureView', checkedValues);
  }

  onSpecialFeatureFacilitiesChange = (checkedValues) => {
    this.setSelected('specialFeatureFacilities', checkedValues);
  }
 
  onSpecialFeatureNearbyPlacesChange = (checkedValues) => {
    this.setSelected('specialFeatureNearbyPlaces', checkedValues);
  }

  onSpecialFeaturePrivateChange = (checkedValues) => {
    this.setSelected('specialFeaturePrivate', checkedValues);
  }

  setSelected = (key, value) => {
    this.setState({selected: { ...this.state.selected, [key]: value }}, () => {
      this.props.onChange(this.state.selected);
    });
  }

  handleFilter = () => {
    this.props.onSelect(this.state.selected);
  }

  // handleCheckAll = () => {
  //   const { items } = this.props;
  //   this.onSpecialFeatureViewChange(items.specialFeatureView.data);
  //   this.onSpecialFeatureFacilitiesChange(items.specialFeatureFacilities.data);
  //   this.onSpecialFeatureNearbyPlacesChange(items.specialFeatureNearbyPlaces.data);
  //   this.onSpecialFeaturePrivateChange(items.specialFeaturePrivate.data);
  //   this.setState(prevState => ({
  //     checkAll: !prevState.checkAll,
  //   }));
  // }

  render() {

    const { items, defaultValue } = this.props;
    const { selected } = this.state;

    if ( !items ) return <div></div>;

    const setValue = {
      specialFeatureView: selected.specialFeatureView.length > 0 ? selected.specialFeatureView : defaultValue.specialFeatureView,
      specialFeatureFacilities: selected.specialFeatureFacilities.length > 0 ? selected.specialFeatureFacilities : defaultValue.specialFeatureFacilities,
      specialFeatureNearbyPlaces: selected.specialFeatureNearbyPlaces.length > 0 ? selected.specialFeatureNearbyPlaces : defaultValue.specialFeatureNearbyPlaces,
      specialFeaturePrivate: selected.specialFeaturePrivate.length > 0 ? selected.specialFeaturePrivate : defaultValue.specialFeaturePrivate,
    }

    return (
      <div className="SpecialFeature">
        <div className="head">
          <div className="clearfix">
            <div className="pull-left">
              <h4>คุณสมบัติพิเศษ</h4>
            </div>
            <div className="pull-right">
              {/*<Checkbox checked={checkAll} onChange={this.handleCheckAll}>เลือกทั้งหมด</Checkbox>*/}
            </div>
          </div>
        </div>
        <div className="list">
          <div className="row">
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeatureView.name}</div>
              <div className="filter">
                <CheckboxGroup options={items.specialFeatureView.data} value={setValue.specialFeatureView} onChange={this.onSpecialFeatureViewChange} />
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeatureFacilities.name}</div>
              <div className="filter">
                <CheckboxGroup options={items.specialFeatureFacilities.data} value={setValue.specialFeatureFacilities} onChange={this.onSpecialFeatureFacilitiesChange} />
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeatureNearbyPlaces.name}</div>
              <div className="filter">
                <CheckboxGroup options={items.specialFeatureNearbyPlaces.data} value={setValue.specialFeatureNearbyPlaces} onChange={this.onSpecialFeatureNearbyPlacesChange} />
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeaturePrivate.name}</div>
              <div className="filter">
                <CheckboxGroup options={items.specialFeaturePrivate.data} value={setValue.specialFeaturePrivate} onChange={this.onSpecialFeaturePrivateChange} />
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
              <Button className="btn-main" onClick={this.handleFilter} style={{width:100}} >ตกลง</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SpecialFeature;
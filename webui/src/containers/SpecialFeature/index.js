import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Checkbox, Button } from 'antd';

import * as SellActions from '../../actions/sell-actions';

const CheckboxGroup = Checkbox.Group;

class SpecialFeature extends Component {

  static defaultProps = {
    items: {},
    defaultValue: {
      specialFeatureView: [],
      specialFeatureFacilities: [],
      specialFeatureNearbyPlaces: [],
      specialFeaturePrivate: [],
    },
  }

  constructor(props) {
    super(props);
    const setValue = {
      specialFeatureView: _.size(props.defaultValue.specialFeatureView) > 0 ?
      _.filter(props.defaultValue.specialFeatureView, (value) => { return _.includes(props.items.specialFeatureView.data, value); }) : [],
      specialFeatureFacilities: _.size(props.defaultValue.specialFeatureFacilities) > 0 ?
      _.filter(props.defaultValue.specialFeatureFacilities, (value) => { return _.includes(props.items.specialFeatureFacilities.data, value); }) : [],
      specialFeatureNearbyPlaces: _.size(props.defaultValue.specialFeatureNearbyPlaces) > 0 ?
      _.filter(props.defaultValue.specialFeatureNearbyPlaces, (value) => { return _.includes(props.items.specialFeatureNearbyPlaces.data, value); }) : [],
      specialFeaturePrivate: _.size(props.defaultValue.specialFeaturePrivate) > 0 ?
      _.filter(props.defaultValue.specialFeaturePrivate, (value) => { return _.includes(props.items.specialFeaturePrivate.data, value); }) : [],
    };
    this.state.selected = setValue;
    const { saveStep } = this.props.actions;
    saveStep('step1', setValue);
  }

  state = {
    checkAll: false,
    selected: {
      specialFeatureView: [],
      specialFeatureFacilities: [],
      specialFeatureNearbyPlaces: [],
      specialFeaturePrivate: [],
    },
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
    this.setState({ selected: { ...this.state.selected, [key]: value } }, () => {
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
    const { items } = this.props;
    const { selected } = this.state;

    if (!items) return <div />;

    // const setValue = {
    //   specialFeatureView: _.size(selected.specialFeatureView) > 0 ?
    //   _.filter(selected.specialFeatureView, (value) => { return _.includes(items.specialFeatureView.data, value); }) : [],
    //   specialFeatureFacilities: _.size(selected.specialFeatureFacilities) > 0 ?
    //   _.filter(selected.specialFeatureFacilities, (value) => { return _.includes(items.specialFeatureFacilities.data, value); }) : [],
    //   specialFeatureNearbyPlaces: _.size(selected.specialFeatureNearbyPlaces) > 0 ?
    //   _.filter(selected.specialFeatureNearbyPlaces, (value) => { return _.includes(items.specialFeatureNearbyPlaces.data, value); }) : [],
    //   specialFeaturePrivate: _.size(selected.specialFeaturePrivate) > 0 ?
    //   _.filter(selected.specialFeaturePrivate, (value) => { return _.includes(items.specialFeaturePrivate.data, value); }) : [],
    // };

    // console.log('setValue', setValue);

    return (
      <div className="SpecialFeature">
        <div className="head">
          <div className="clearfix">
            <div className="pull-left">
              <h4>คุณสมบัติพิเศษ</h4>
            </div>
            <div className="pull-right">
              { /* <Checkbox checked={checkAll} onChange={this.handleCheckAll}>เลือกทั้งหมด</Checkbox> */ }
            </div>
          </div>
        </div>
        <div className="list">
          <div className="row">
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeatureView.name}</div>
              <div className="filter">
                <CheckboxGroup
                  options={items.specialFeatureView.data}
                  onChange={this.onSpecialFeatureViewChange}
                  value={selected.specialFeatureView}
                />
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeatureFacilities.name}</div>
              <div className="filter">
                <CheckboxGroup
                  options={items.specialFeatureFacilities.data}
                  onChange={this.onSpecialFeatureFacilitiesChange}
                  value={selected.specialFeatureFacilities}
                />
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeatureNearbyPlaces.name}</div>
              <div className="filter">
                <CheckboxGroup
                  options={items.specialFeatureNearbyPlaces.data}
                  onChange={this.onSpecialFeatureNearbyPlacesChange}
                  value={selected.specialFeatureNearbyPlaces}
                />
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="title">{items.specialFeaturePrivate.name}</div>
              <div className="filter">
                <CheckboxGroup
                  options={items.specialFeaturePrivate.data}
                  onChange={this.onSpecialFeaturePrivateChange}
                  value={selected.specialFeaturePrivate}
                />
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
              <Button className="btn-main" onClick={this.handleFilter} style={{ width: 100 }} >ตกลง</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const actions = {
  saveStep: SellActions.saveStep,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialFeature);

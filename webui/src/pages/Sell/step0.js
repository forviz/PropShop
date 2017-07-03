import React, { Component } from 'react';
import T from 'prop-types';
import { Input, Select, Button, Spin } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import _ from 'lodash';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

import SelectSellType from '../../components/SelectSellType';
import SelectResidentialType from '../../components/SelectResidentialType';
import SelectRoom from '../../components/SelectRoom';

import provinceJSON from '../../../public/data/province.json';
import amphurJSON from '../../../public/data/amphur.json';
import districtJSON from '../../../public/data/district.json';

import * as SellActions from '../../actions/sell-actions';

const Option = Select.Option;

const AsyncGettingStartedExampleGoogleMap = withScriptjs(
  withGoogleMap(
    props => (
      <GoogleMap
        ref={props.onMapLoad}
        zoom={props.zoom}
        center={props.center}
        onClick={props.onMapClick}
      >
        {props.markers.map(marker => (
          <Marker
            {...marker}
            // icon="https://material.io/guidelines/static/spec/images/callouts/default.svg"
            // onRightClick={() => props.onMarkerRightClick(marker)}
          />
        ))}
      </GoogleMap>
    )
  )
);

class Step0 extends Component {

  static propTypes = {
    data: T.object,
  }

  delay = (() => {
    let timer = 0;
    return (callback, ms) => {
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  getProvince = (id) => {
    return _.find(provinceJSON, (province) => { return province.PROVINCE_ID === id });
  }

  getAmphur = (id) => {
    return _.find(amphurJSON, (amphur) => { return amphur.AMPHUR_ID === id });
  }

  getDistrict = (id) => {
    return _.find(districtJSON, (district) => { return district.DISTRICT_ID === id });
  }

  setLocation = () => {
    console.log('setLocation', this.props.data);
    let address = '';
    address = this.props.data.province ? this.getProvince(this.props.data.provinceId).PROVINCE_NAME : '';
    if ( this.props.data.district ) {
      address += '+'+this.getDistrict(this.props.data.districtId).DISTRICT_NAME;
    } else if ( this.props.data.amphur ) {
      address += '+'+this.getAmphur(this.props.data.amphurId).AMPHUR_NAME;
    }
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address;
    fetch(url)
    .then(response => response.json())
    .then((result) => {
      const newData = {
        ...this.props.data,
        'googleMap': {
          ...this.props.data.googleMap,
          zoom: 13,
          markers: [{
            position: {
              lat: result.results[0].geometry.location.lat,
              lng: result.results[0].geometry.location.lng,
            },
            key: Date.now(),
            defaultAnimation: 2,
          }]
        }
      }
      this.setData(newData);
    })
    .catch(err => console.error(err));
  }

  handleMapLoad = this.handleMapLoad.bind(this);
  handleMapClick = this.handleMapClick.bind(this);
  // handleMarkerRightClick = this.handleMarkerRightClick.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log('handleMapLoad', map);
    }
  }

  handleMapClick(event) {
    console.log('handleMapClick', event);

    const nextMarkers = [
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      },
    ];

    const newData = {
      ...this.props.data,
      'googleMap': {
        ...this.props.data.googleMap,
        markers: nextMarkers,
      }
    }
    this.setData(newData);

    // if (nextMarkers.length === 3) {
    //   this.props.toast(
    //     `Right click on the marker to remove it`,
    //     `Also check the code!`
    //   );
    // }
  }

  // handleMarkerRightClick(targetMarker) {
  //   const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
  //   this.setState({
  //     markers: nextMarkers,
  //   });
  // }



  setData = (newData) => {
    const { saveStep } = this.props.actions;
    return saveStep('step0', newData);
  }

  handleSelectFor = (value) => {
    const newData = {
      ...this.props.data,
      'for': value
    }
    this.setData(newData);
  }

  handleSelectResidentialType = (value) => {
    const newData = {
      ...this.props.data,
      residentialType: value,
    };
    this.setData(newData);

    const { addRequiredField, removeRequiredField } = this.props.actions;
    const lists = ["Town-home", "House", "Land"];
    lists.includes(value) ? addRequiredField('landSize') : removeRequiredField('landSize');
    value === 'Land' ? removeRequiredField('areaSize') : addRequiredField('areaSize');
  }

  handleInputTopic = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'topic': value
    }
    this.setData(newData);
  }

  handleInputAnnouncementDetails = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'announcementDetails': value
    }
    this.setData(newData);
  }

  sumAreaSize = () => {
    if ( this.props.data.areaSize0 && this.props.data.areaSize1 ) {
      const sumAreaSize = this.props.data.areaSize0*this.props.data.areaSize1;
      const newData = {
        ...this.props.data,
        'areaSize': sumAreaSize
      }
      this.setData(newData).then(() => {
        this.findPricePerUnit();
      });
    }
  }

  handleInputAreaSize0 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'areaSize0': value.replace(/\D/g, '')
    }
    this.setData(newData).then(() => {
      this.sumAreaSize();
    });
  }

  handleInputAreaSize1 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'areaSize1': value.replace(/\D/g, '')
    }
    this.setData(newData).then(() => {
      this.sumAreaSize();
    });
  }

  findPricePerUnit = () => {
    const size = this.props.data.residentialType === 'Land' ? this.props.data.landSize * 4 : this.props.data.areaSize;
    if ( size && this.props.data.price ) {
      const pricePerUnit = this.props.data.price / size;
      const newData = {
        ...this.props.data,
        'pricePerUnit': pricePerUnit
      }
      this.setData(newData);
    }
  }

  handleInputSumAreaSize = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'areaSize': value.replace(/\D/g, ''),
      'areaSize0': '',
      'areaSize1': '',
    }
    this.setData(newData).then(() => {
      this.findPricePerUnit();
    });
  }

  sumLandSize = () => {
    if ( this.props.data.landSize0 && this.props.data.landSize1 ) {
      const sumLandSize = Math.round(this.props.data.landSize0 * this.props.data.landSize1 / 4);
      const newData = {
        ...this.props.data,
        'landSize': sumLandSize
      }
      this.setData(newData).then(() => {
        this.findPricePerUnit();
      });
    }
  }

  handleInputLandSize0 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'landSize0': value.replace(/\D/g, '')
    }
    this.setData(newData).then(() => {
      this.sumLandSize();
    });
  }

  handleInputLandSize1 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'landSize1': value.replace(/\D/g, '')
    }
    this.setData(newData).then(() => {
      this.sumLandSize();
    });
  }

  handleInputSumLandSize = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'landSize': value.replace(/\D/g, ''),
      'landSize0': '',
      'landSize1': '',
    }
    this.setData(newData).then(() => {
      this.findPricePerUnit();
    });
  }

  handleSelectBedRoom = (value) => {
    const newData = {
      ...this.props.data,
      'bedroom': value
    }
    this.setData(newData);
  }

  handleSelectBathRoom = (value) => {
    const newData = {
      ...this.props.data,
      'bathroom': value
    }
    this.setData(newData);
  }

  handleInputPrice = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'price': value.replace(/\D/g, ''),
    }
    this.setData(newData).then(() => {
      this.findPricePerUnit();
    });
  }

  handleInputPricePerUnit = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'pricePerUnit': value
    }
    this.setData(newData);
  }

  handleInputFee = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'fee': value.replace(/\D/g, '')
    }
    this.setData(newData);
  }

  handleProjectName = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'project': value
    }
    this.setData(newData);
  }

  handleSelectProvince = (value) => {
    const newData = {
      ...this.props.data,
      'provinceId': value,
      'province': this.getProvince(value).PROVINCE_NAME,
      'amphur': '',
      'district': '',
    }
    this.setData(newData).then(() => {
      this.setLocation();
    });
  }

  handleSelectAmphur = (value) => {
    const newData = {
      ...this.props.data,
      'amphurId': value,
      'amphur': this.getAmphur(value).AMPHUR_NAME,
      'district': '',
    }
    this.setData(newData).then(() => {
      this.setLocation();
    });
  }

  handleSelectDistrict = (value) => {
    const newData = {
      ...this.props.data,
      'districtId': value,
      'district': this.getDistrict(value).DISTRICT_NAME,
    }
    this.setData(newData).then(() => {
      this.setLocation();
    });
  }

  handleAddress = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'address': value
    }
    this.setData(newData);
  }

  handleStreet = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'street': value
    }
    this.setData(newData);
  }

  handleZipcode = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      'zipcode': value.replace(/\D/g, ''),
    }
    this.setData(newData);
  }

  render() {

    const { data } = this.props;

    let amphurData = [];
    if ( data.province !== '' ) {
      const amphurJSONFilter = _.filter(amphurJSON, (amphur) => { return amphur.PROVINCE_ID === data.provinceId });
      amphurData = _.map(amphurJSONFilter, (value, index) => {
        return <Option key={index} value={value.AMPHUR_ID} >{value.AMPHUR_NAME}</Option>;
      });
    }

    let districtData = [];
    if ( data.amphur !== '' ) {
      const districtJSONFilter = _.filter(districtJSON, (district) => { return district.AMPHUR_ID === data.amphurId });
      districtData = _.map(districtJSONFilter, (value, index) => {
        return <Option key={index} value={value.DISTRICT_ID} >{value.DISTRICT_NAME}</Option>;
      });
    }

    return (
      <div id="Step0">
        <div className="container">
          <div className="row">
            <h1>รายละเอียดทรัพย์สิน</h1>
            <div className="col-md-10 col-md-offset-1">
              <div className="row form" style={{ border: '1px solid #eeeeee', borderRadius: 4 }}>
                <section className="form_1">
                  <h4>ข้อมูลทั่วไป</h4>
                  <div className="row">
                    <div className="col-md-10 col-md-offset-1 custom-col">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('for') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ประกาศประเภท
                            </label>
                            <div style={{ width: '100%' }}>
                              <SelectSellType placeholder="เลือก" value={data.for} onChange={this.handleSelectFor} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('residentialType') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ประกาศอสังหาฯ
                            </label>
                            <div style={{ width: '100%' }} >
                              <SelectResidentialType placeholder="เลือก" value={data.residentialType} onChange={this.handleSelectResidentialType} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          {data.requiredField.includes('topic') &&
                            <span className="text-red">*&nbsp;</span>
                          }
                          หัวข้อประกาศ
                        </label>
                        <Input value={data.topic} onChange={this.handleInputTopic} />
                      </div>
                      <div className="form-group">
                        <label>
                          {data.requiredField.includes('announcementDetails') &&
                            <span className="text-red">*&nbsp;</span>
                          }
                          รายละเอียดเกี่ยวกับประกาศ
                        </label>
                        <Input type="textarea" rows={4} value={data.announcementDetails ? data.announcementDetails : []} onChange={this.handleInputAnnouncementDetails} />
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>ขนาดพื้นที่</label>
                            <div>
                              <Input type="text" style={{ width: '40%', display: 'inline-block' }} value={data.areaSize0} onChange={this.handleInputAreaSize0} disabled={!data.requiredField.includes('areaSize')} />
                              &nbsp;<span>X</span>&nbsp;
                              <Input type="text" style={{ width: '40%', display: 'inline-block' }} value={data.areaSize1} onChange={this.handleInputAreaSize1} disabled={!data.requiredField.includes('areaSize')} /> ม.
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('areaSize') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              พื้นที่ใช้สอย
                            </label>
                            <div>
                              <Input type="text" style={{ width: '80%', display: 'inline-block' }} value={data.areaSize} onChange={this.handleInputSumAreaSize} disabled={!data.requiredField.includes('areaSize')} /> ตร.ม.
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>ขนาดที่ดิน</label>
                            <div>
                              <Input type="text" style={{ width: '40%', display: 'inline-block' }} value={data.landSize0} onChange={this.handleInputLandSize0} disabled={!data.requiredField.includes('landSize')} />
                              &nbsp;<span>X</span>&nbsp;
                              <Input type="text" style={{ width: '40%', display: 'inline-block' }} value={data.landSize1} onChange={this.handleInputLandSize1} disabled={!data.requiredField.includes('landSize')} /> ม.
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('landSize') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              จำนวนที่ดิน
                            </label>
                            <div>
                              <Input type="text" style={{ width: '49%', display: 'inline-block' }} value={data.landSize} onChange={this.handleInputSumLandSize} disabled={!data.requiredField.includes('landSize')} /> ตร.ว.
                              {/*
                              <Select defaultValue="ตร.ว." style={{ width: '48%', display: 'inline-block' }} disabled={!data.requiredField.includes('landSize')} >
                                <Option value="ตร.ว.">ตร.ว.</Option>
                                <Option value="งาน">งาน</Option>
                                <Option value="ไร่">ไร่</Option>
                              </Select>
                              */}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('bedroom') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ห้องนอน
                            </label>
                            <div style={{ width: '100%' }} >
                              <SelectRoom placeholder="--" value={data.bedroom} onChange={this.handleSelectBedRoom} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('bathroom') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ห้องน้ำ
                            </label>
                            <div style={{ width: '100%' }} >
                              <SelectRoom placeholder="--" value={data.bathroom} onChange={this.handleSelectBathRoom} />
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('price') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ราคา
                            </label>
                            <Input type="text" style={{ width: '90%', display: 'inline-block' }} value={data.price} onChange={this.handleInputPrice} /> บาท
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>ราคาต่อหน่วย</label>
                            <Input type="text" value={numeral(data.pricePerUnit).format('0,0.00')} onChange={this.handleInputPricePerUnit} disabled={true} />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label className="visibility-hidden">hidden</label>
                            <Select value="บาทต่อ ตร.ม." style={{ width: '100%' }} >
                              <Option value="บาทต่อ ตร.ม.">บาทต่อ ตร.ม.</Option>
                            </Select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('fee') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ค่าธรรมเนียมและภาษีโดยประมาณ
                            </label>
                            <Input type="text" style={{ width: '90%', display: 'inline-block' }} value={data.fee} onChange={this.handleInputFee} /> บาท
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <hr />
                <section className="form_2">
                  <h4>รายละเอียดที่ตั้ง</h4>
                  <div className="row">
                    <div className="col-md-10 col-md-offset-1 custom-col">
                      <div className="form-group">
                        <label>
                          {data.requiredField.includes('project') &&
                            <span className="text-red">*&nbsp;</span>
                          }
                          ชื่อโครงการ
                        </label>
                        <Input value={data.project} onChange={this.handleProjectName} />
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('province') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              จังหวัด
                            </label>
                            <Select
                              placeholder="เลือก"
                              value={data.province ? data.province : []}
                              onChange={this.handleSelectProvince}
                              style={{ width: '100%' }}
                            >
                              {
                                _.map(provinceJSON, (value, index) => {
                                  return (
                                    <Option key={index} value={value.PROVINCE_ID}>{value.PROVINCE_NAME}</Option>
                                  );
                                })
                              }
                            </Select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('amphur') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              อำเภอ/เขต
                            </label>
                            <Select
                              placeholder="เลือกจังหวัด"
                              value={data.amphur ? data.amphur : []}
                              disabled={data.province !== '' ? false : true}
                              onChange={this.handleSelectAmphur}
                              style={{ width: '100%' }}
                            >
                              {amphurData}
                            </Select>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('district') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ตำบล/แขวง
                            </label>
                            <Select
                              placeholder="เลือกอำเภอ/เขต"
                              value={data.district ? data.district : []}
                              disabled={data.amphur !== '' ? false : true}
                              onChange={this.handleSelectDistrict}
                              style={{ width: '100%' }}
                            >
                              {districtData}
                            </Select>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('address') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              เลขที่
                            </label>
                            <Input type="text" value={data.address} onChange={this.handleAddress} />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('street') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              ถนน
                            </label>
                            <Input type="text" value={data.street} onChange={this.handleStreet} />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('zipcode') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              รหัสไปรษณีย์
                            </label>
                            <Input type="text" value={data.zipcode} onChange={this.handleZipcode} maxLength="5" />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>
                              {data.requiredField.includes('location') &&
                                <span className="text-red">*&nbsp;</span>
                              }
                              แผนที่
                            </label>
                            <div>
                              <Button type="select" style={{ width: '100%' }} >
                                คลิกที่แผนที่เพื่อปักหมุด <FontAwesome name="map-marker" style={{ fontSize: 18 }} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div style={{ width: '100%', height: 500 }}>
                            <AsyncGettingStartedExampleGoogleMap
                              googleMapURL={"https://maps.googleapis.com/maps/api/js?v=3.exp&key="+process.env.REACT_APP_APIKEY}
                              loadingElement={<Spin />}
                              containerElement={
                                <div style={{ height: `100%` }} />
                              }
                              mapElement={
                                <div style={{ height: `100%` }} />
                              }
                              zoom={data.googleMap.zoom}
                              center={data.googleMap.markers[0].position}
                              onMapLoad={this.handleMapLoad}
                              onMapClick={this.handleMapClick}
                              markers={data.googleMap.markers}
                              // onMarkerRightClick={this.handleMarkerRightClick}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state.sell.step0,
  };
}

const mapStep0DataToSubmitData = (data) => {
  console.log('data', data);
  return data;
};

const actions = {
  submit: (step, propertyData) => {
    return (dispatch) => {
      console.log('propertyData', propertyData);
      const submitData = mapStep0DataToSubmitData(propertyData);
      dispatch({
        type: 'POST/SUBMIT/STEP0',
        data: submitData,
      });
    }
  },
  saveStep: SellActions.saveStep,
  addRequiredField: SellActions.addRequiredField,
  removeRequiredField: SellActions.removeRequiredField,
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Step0);

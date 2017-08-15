import React, { Component } from 'react';
import T from 'prop-types';
import { Input, Select, Button, Spin, Form } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import withScriptjs from 'react-google-maps/lib/async/withScriptjs';
import _ from 'lodash';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import NumberFormat from 'react-number-format';

import SelectSellType from '../../components/SelectSellType';
import SelectResidentialType from '../../components/SelectResidentialType';
import SelectRoom from '../../components/SelectRoom';

import provinceJSON from './province.json';
import amphurJSON from './amphur.json';
import districtJSON from './district.json';

import * as SellActions from '../../actions/sell-actions';

const Option = Select.Option;
const FormItem = Form.Item;

const AsyncGettingStartedExampleGoogleMap = withScriptjs(
  withGoogleMap(
    props => (
      <GoogleMap
        ref={props.onMapLoad}
        defaultZoom={props.zoom}
        defaultCenter={props.center}
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
    ),
  ),
);

class Step0 extends Component {

  static propTypes = {
    data: T.shape().isRequired,
    form: T.shape().isRequired,
  }

  setLocation = () => {
    let address = '';
    address = this.props.data.province ? this.findProvince(this.props.data.provinceId).PROVINCE_NAME : '';
    if (this.props.data.district) {
      address += `+${this.findDistrict(this.props.data.districtId).DISTRICT_NAME}`;
    } else if (this.props.data.amphur) {
      address += `+${this.findAmphur(this.props.data.amphurId).AMPHUR_NAME}`;
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`;
    fetch(url)
    .then(response => response.json())
    .then((result) => {
      const newData = {
        ...this.props.data,
        googleMap: {
          ...this.props.data.googleMap,
          zoom: 13,
          markers: [{
            position: {
              lat: result.results[0].geometry.location.lat,
              lng: result.results[0].geometry.location.lng,
            },
            key: Date.now(),
            defaultAnimation: 2,
          }],
        },
      };
      this.setData(newData);
    })
    .catch(err => console.error(err));
  }

  setData = (newData) => {
    const { saveStep } = this.props.actions;
    return saveStep('step0', newData);
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
      googleMap: {
        ...this.props.data.googleMap,
        markers: nextMarkers,
      },
    };
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

  delay = (() => {
    let timer = 0;
    return (callback, ms) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  handleSelectFor = (value) => {
    const newData = {
      ...this.props.data,
      for: value,
    };
    this.setData(newData);
  }

  handleSelectResidentialType = (value) => {
    const newData = {
      ...this.props.data,
      residentialType: value,
    };
    this.setData(newData);

    const { addRequiredField, removeRequiredField } = this.props.actions;
    const lists = ['Town-home', 'House', 'Land'];
    lists.includes(value) ? addRequiredField('landSize') : removeRequiredField('landSize');
    value === 'Land' ? removeRequiredField('areaSize') : addRequiredField('areaSize');
  }

  handleInputTopic = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      topic: value,
    };
    this.setData(newData);
  }

  handleInputAnnouncementDetails = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      announcementDetails: value,
    };
    this.setData(newData);
  }

  sumAreaSize = () => {
    if (this.props.data.areaSize0 && this.props.data.areaSize1) {
      const sumAreaSize = this.props.data.areaSize0 * this.props.data.areaSize1;
      const newData = {
        ...this.props.data,
        areaSize: sumAreaSize,
      };
      this.setData(newData).then(() => {
        this.findPricePerUnit();
      });
    }
  }

  handleInputAreaSize0 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      areaSize0: value.replace(/\D/g, ''),
    };
    this.setData(newData).then(() => {
      this.sumAreaSize();
    });
  }

  handleInputAreaSize1 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      areaSize1: value.replace(/\D/g, ''),
    };
    this.setData(newData).then(() => {
      this.sumAreaSize();
    });
  }

  findPricePerUnit = () => {
    const size = this.props.data.residentialType === 'Land' ? this.props.data.landSize * 4 : this.props.data.areaSize;
    if (size && this.props.data.price) {
      const pricePerUnit = this.props.data.price / size;
      const newData = {
        ...this.props.data,
        pricePerUnit,
      };
      this.setData(newData);
    }
  }

  handleInputSumAreaSize = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      areaSize: value.replace(/\D/g, ''),
      areaSize0: '',
      areaSize1: '',
    };
    this.setData(newData).then(() => {
      this.findPricePerUnit();
    });
  }

  sumLandSize = () => {
    if (this.props.data.landSize0 && this.props.data.landSize1) {
      const sumLandSize = Math.round((this.props.data.landSize0 * this.props.data.landSize1) / 4);
      const newData = {
        ...this.props.data,
        landSize: sumLandSize,
      };
      this.setData(newData).then(() => {
        this.findPricePerUnit();
      });
    }
  }

  handleInputLandSize0 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      landSize0: value.replace(/\D/g, ''),
    };
    this.setData(newData).then(() => {
      this.sumLandSize();
    });
  }

  handleInputLandSize1 = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      landSize1: value.replace(/\D/g, ''),
    };
    this.setData(newData).then(() => {
      this.sumLandSize();
    });
  }

  handleInputSumLandSize = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      landSize: value.replace(/\D/g, ''),
      landSize0: '',
      landSize1: '',
    };
    this.setData(newData).then(() => {
      this.findPricePerUnit();
    });
  }

  handleSelectBedRoom = (value) => {
    const newData = {
      ...this.props.data,
      bedroom: value,
    };
    this.setData(newData);
  }

  handleSelectBathRoom = (value) => {
    const newData = {
      ...this.props.data,
      bathroom: value,
    };
    this.setData(newData);
  }

  handleInputPrice = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      price: value.replace(/\D/g, ''),
    };
    this.setData(newData).then(() => {
      this.findPricePerUnit();
    });
  }

  handleInputPricePerUnit = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      pricePerUnit: value,
    };
    this.setData(newData);
  }

  handleInputFee = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      fee: value.replace(/\D/g, ''),
    };
    this.setData(newData);
  }

  handleProjectName = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      project: value,
    };
    this.setData(newData);
  }

  handleSelectProvince = (value) => {
    const newData = {
      ...this.props.data,
      provinceId: value,
      province: this.findProvince(value).PROVINCE_NAME,
      amphur: '',
      district: '',
    };
    this.setData(newData).then(() => {
      this.setLocation();
    });
  }

  handleSelectAmphur = (value) => {
    const newData = {
      ...this.props.data,
      amphurId: value,
      amphur: this.findAmphur(value).AMPHUR_NAME,
      district: '',
    };
    this.setData(newData).then(() => {
      this.setLocation();
    });
  }

  handleSelectDistrict = (value) => {
    const newData = {
      ...this.props.data,
      districtId: value,
      district: this.findDistrict(value).DISTRICT_NAME,
    };
    this.setData(newData).then(() => {
      this.setLocation();
    });
  }

  handleAddress = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      address: value,
    };
    this.setData(newData);
  }

  handleStreet = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      street: value,
    };
    this.setData(newData);
  }

  handleZipcode = (e) => {
    const value = e.target.value;
    const newData = {
      ...this.props.data,
      zipcode: value.replace(/\D/g, ''),
    };
    this.setData(newData);
  }

  getDistrict = () => {
    const { data } = this.props;
    if (data.amphur !== '') {
      const districtJSONFilter = _.filter(districtJSON, (district) => { return district.AMPHUR_ID === data.amphurId; });
      return _.map(districtJSONFilter, (value, index) => {
        return <Option key={index} value={value.DISTRICT_ID} >{value.DISTRICT_NAME}</Option>;
      });
    }
    return [];
  }

  getAmphur = () => {
    const { data } = this.props;
    if (data.province !== '') {
      const amphurJSONFilter = _.filter(amphurJSON, (amphur) => { return amphur.PROVINCE_ID === data.provinceId; });
      return _.map(amphurJSONFilter, (value, index) => {
        return <Option key={index} value={value.AMPHUR_ID} >{value.AMPHUR_NAME}</Option>;
      });
    }
    return [];
  }

  getProvince = () => {
    return _.map(provinceJSON, (value, index) => {
      return (
        <Option key={index} value={value.PROVINCE_ID}>{value.PROVINCE_NAME}</Option>
      );
    });
  }

  findProvince = (id) => {
    return _.find(provinceJSON, (province) => { return province.PROVINCE_ID === id; });
  }

  findAmphur = (id) => {
    return _.find(amphurJSON, (amphur) => { return amphur.AMPHUR_ID === id; });
  }

  findDistrict = (id) => {
    return _.find(districtJSON, (district) => { return district.DISTRICT_ID === id; });
  }

  render() {
    const { data } = this.props;
    const { getFieldDecorator } = this.props.form;

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
                          <FormItem
                            label="ประกาศประเภท"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('for', {
                              initialValue: data.for,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <SelectSellType
                                type="seller"
                                placeholder="เลือก"
                                value={data.for}
                                onChange={this.handleSelectFor}
                              />,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-6">
                          <FormItem
                            label="ประกาศอสังหาฯ"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('residentialType', {
                              initialValue: data.residentialType,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <SelectResidentialType
                                placeholder="เลือก"
                                value={data.residentialType}
                                onChange={this.handleSelectResidentialType}
                              />,
                            )}
                          </FormItem>
                        </div>
                      </div>
                      <FormItem
                        label="หัวข้อประกาศ"
                        hasFeedback
                        colon={false}
                      >
                        {getFieldDecorator('topic', {
                          initialValue: data.topic,
                          rules: [{
                            required: true, message: 'Required!',
                          }],
                        })(
                          <Input value={data.topic} onChange={this.handleInputTopic} />,
                        )}
                      </FormItem>
                      <FormItem
                        label="รายละเอียดเกี่ยวกับประกาศ"
                        hasFeedback
                        colon={false}
                      >
                        {getFieldDecorator('announcementDetails', {
                          initialValue: data.announcementDetails,
                          rules: [{
                            required: true, message: 'Required!',
                          }],
                        })(
                          <Input
                            type="textarea"
                            rows={4}
                            value={data.announcementDetails ? data.announcementDetails : []}
                            onChange={this.handleInputAnnouncementDetails}
                          />,
                        )}
                      </FormItem>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>ขนาดพื้นที่</label>
                            <div>
                              <Input
                                type="text"
                                style={{ width: '40%', display: 'inline-block' }}
                                value={data.areaSize0}
                                onChange={this.handleInputAreaSize0}
                                disabled={!data.requiredField.includes('areaSize')}
                              />
                              &nbsp;<span>X</span>&nbsp;
                              <Input
                                type="text"
                                style={{ width: '40%', display: 'inline-block' }}
                                value={data.areaSize1}
                                onChange={this.handleInputAreaSize1}
                                disabled={!data.requiredField.includes('areaSize')}
                              /> ม.
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
                              <Input
                                type="text"
                                style={{ width: '80%', display: 'inline-block' }}
                                value={data.areaSize}
                                onChange={this.handleInputSumAreaSize}
                                disabled={!data.requiredField.includes('areaSize')}
                              /> ตร.ม.
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>ขนาดที่ดิน</label>
                            <div>
                              <Input
                                type="text"
                                style={{ width: '40%', display: 'inline-block' }}
                                value={data.landSize0}
                                onChange={this.handleInputLandSize0}
                                disabled={!data.requiredField.includes('landSize')}
                              />
                              &nbsp;<span>X</span>&nbsp;
                              <Input
                                type="text"
                                style={{ width: '40%', display: 'inline-block' }}
                                value={data.landSize1}
                                onChange={this.handleInputLandSize1}
                                disabled={!data.requiredField.includes('landSize')}
                              /> ม.
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
                              <Input
                                type="text"
                                style={{ width: '78%', display: 'inline-block' }}
                                value={data.landSize}
                                onChange={this.handleInputSumLandSize}
                                disabled={!data.requiredField.includes('landSize')}
                              /> ตร.ว.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <FormItem
                            label="ห้องนอน"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('bedroom', {
                              initialValue: data.bedroom,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <SelectRoom placeholder="ห้องนอน" value={data.bedroom} onChange={this.handleSelectBedRoom} />,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-3">
                          <FormItem
                            label="ห้องนอน"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('bathroom', {
                              initialValue: data.bathroom,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <SelectRoom placeholder="ห้องน้ำ" value={data.bathroom} onChange={this.handleSelectBathRoom} />,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-6">
                          <FormItem
                            label="ราคา"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('price', {
                              initialValue: data.price,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <NumberFormat
                                className="ant-input"
                                thousandSeparator={true}
                                value={data.price}
                                onChange={this.handleInputPrice}
                                suffix=" บาท"
                              />,
                            )}
                          </FormItem>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>ราคาต่อหน่วย</label>
                            <Input
                              type="text"
                              value={numeral(data.pricePerUnit).format('0,0')}
                              onChange={this.handleInputPricePerUnit}
                              disabled={true}
                            />
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
                            <NumberFormat
                              className="ant-input"
                              thousandSeparator={true}
                              value={data.fee}
                              onChange={this.handleInputFee}
                              suffix=" บาท"
                            />
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
                          <FormItem
                            label="จังหวัด"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('province', {
                              initialValue: data.province,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <div>
                                <Select
                                  size="default"
                                  placeholder="เลือก"
                                  value={data.province ? data.province : []}
                                  onChange={this.handleSelectProvince}
                                  style={{ width: '100%' }}
                                >
                                  {this.getProvince()}
                                </Select>
                              </div>,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-4">
                          <FormItem
                            label="อำเภอ/เขต"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('amphur', {
                              initialValue: data.amphur,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <div>
                                <Select
                                  size="default"
                                  placeholder="เลือกจังหวัดก่อน"
                                  value={data.amphur ? data.amphur : []}
                                  disabled={data.province !== '' ? false : true}
                                  onChange={this.handleSelectAmphur}
                                  style={{ width: '100%' }}
                                >
                                  {this.getAmphur()}
                                </Select>
                              </div>,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-4">
                          <FormItem
                            label="ตำบล/แขวง"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('district', {
                              initialValue: data.district,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <div>
                                <Select
                                  size="default"
                                  placeholder="เลือกอำเภอ/เขตก่อน"
                                  value={data.district ? data.district : []}
                                  disabled={data.amphur !== '' ? false : true}
                                  onChange={this.handleSelectDistrict}
                                  style={{ width: '100%' }}
                                >
                                  {this.getDistrict()}
                                </Select>
                              </div>,
                            )}
                          </FormItem>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-3">
                          <FormItem
                            label="เลขที่"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('address', {
                              initialValue: data.address,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <Input type="text" value={data.address} onChange={this.handleAddress} />,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-3">
                          <FormItem
                            label="ถนน"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('street', {
                              initialValue: data.street,
                              rules: [{
                                required: true, message: 'Required!',
                              }],
                            })(
                              <Input type="text" value={data.street} onChange={this.handleStreet} />,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-3">
                          <FormItem
                            label="รหัสไปรษณีย์"
                            hasFeedback
                            colon={false}
                          >
                            {getFieldDecorator('zipcode', {
                              initialValue: data.zipcode,
                              rules: [{
                                required: true, message: 'Required!',
                              }, {
                                pattern: /^(\d{5})?$/, message: 'ต้องเป็นตัวเลข 5 หลัก!',
                              }],
                            })(
                              <Input type="text" value={data.zipcode} onChange={this.handleZipcode} maxLength="5" />,
                            )}
                          </FormItem>
                        </div>
                        <div className="col-md-3">
                          <FormItem label="แผนที่">
                            <Button type="select" style={{ width: '100%' }} >
                              คลิกที่แผนที่เพื่อปักหมุด <FontAwesome name="map-marker" style={{ fontSize: 18 }} />
                            </Button>
                          </FormItem>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div style={{ width: '100%', height: 500 }}>
                            <AsyncGettingStartedExampleGoogleMap
                              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&key=${process.env.REACT_APP_APIKEY}`}
                              loadingElement={<Spin />}
                              containerElement={
                                <div style={{ height: '100%' }} />
                              }
                              mapElement={
                                <div style={{ height: '100%' }} />
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

const mapStateToProps = (state) => {
  return {
    data: state.sell.step0,
  };
};

const mapStep0DataToSubmitData = (data) => {
  return data;
};

const actions = {
  submit: (step, propertyData) => {
    return (dispatch) => {
      const submitData = mapStep0DataToSubmitData(propertyData);
      dispatch({
        type: 'POST/SUBMIT/STEP0',
        data: submitData,
      });
    };
  },
  saveStep: SellActions.saveStep,
  addRequiredField: SellActions.addRequiredField,
  removeRequiredField: SellActions.removeRequiredField,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Step0);

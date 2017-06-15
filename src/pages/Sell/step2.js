import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import { Tabs, Icon, Button } from 'antd';
import * as contentful from '../../api/contentful';
const TabPane = Tabs.TabPane;

import * as SellActions from '../../actions/sell-actions';

class Step2 extends Component {

  setMainImage = (accepted, rejected) => {
    if ( accepted.length > 0 ) {
      console.log('accepted',accepted[0]);
      const { defaultValue } = this.props;
      const data = {
        ...defaultValue,
        mainImage: accepted[0]
      }
      const file = accepted[0];
      // contentful.uploadFile(file.name, file.type, file).then((entry) => {
      //   console.log('entry', entry);
      // });
      const { saveStep } = this.props.actions;
      saveStep('step2', data);
    } else {
      alert('นามสกุลไฟล์ต้องเป็น jpg,png หรือ video เท่านั้น และขนาดไฟล์ไม่เกิน 4 MB');
      return false;
    }
  }

  setImages = (accepted, rejected) => {
    if ( accepted.length > 0 ) {
      const { defaultValue } = this.props;
      let images = defaultValue.images;
      _.map(accepted, (accept, index) => {
        images.push(accept);
      });
      const data = {
        ...defaultValue,
        images: images
      }
      const { saveStep } = this.props.actions;
      saveStep('step2', data);
    } else {
      alert('นามสกุลไฟล์ต้องเป็น jpg,png หรือ video เท่านั้น และขนาดไฟล์ไม่เกิน 4 MB');
      return false;
    }
  }

  handleDeleteMainImage = () => {
    const { defaultValue } = this.props;
    const data = {
      ...defaultValue,
      mainImage: {}
    }
    const { saveStep } = this.props.actions;
    saveStep('step2', data);
  }

  handleDeleteImages = (index) => {
    const { defaultValue } = this.props;
    let images = defaultValue.images;
    images.splice(index, 1);
    const data = {
      ...defaultValue,
      mainImage: images
    }
    const { saveStep } = this.props.actions;
    saveStep('step2', data);
  }

  render() {

    let dropzoneRefMainImage;
    let dropzoneRefImages;

    const { defaultValue } = this.props;

    console.log('defaultValue', defaultValue);

    const hasMainImage = Object.keys(defaultValue.mainImage).length > 0 ? true : false;
    const hasImages = Object.keys(defaultValue.images).length > 0 ? true : false;

    const dropzoneStyle = {
      width: '100%',
      lineHeight: '40px',
      borderWidth: 2,
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRradius: 5,
      padding: '40px 0',
    }
                
    return (
      <div id="Step2">
        <div className="container">
      		<div className="row">
	        	<div className="col-md-8 col-md-offset-2">
	        		<h1>อัพโหลดรูปภาพ</h1>
              <Tabs type="card">
                <TabPane tab="รูปภาพหลัก" key="1">
                  <div className="row">
                    <div className={"col-md-" + (hasMainImage ? 6 : 12) }>
                      <div style={{ textAlign: 'center' }} >
                        <Dropzone accept="image/jpeg, image/png, video/*" maxSize={4000000} multiple={false} name="mainImage" ref={(node) => { dropzoneRefMainImage = node; }} onDrop={(accepted, rejected) => { this.setMainImage(accepted, rejected) }} style={dropzoneStyle} >
                          <p><Icon type="plus" style={{ fontSize: 80, color: '#cccccc' }} /></p>
                          <p style={{ fontFamily: 'SukhumvitSet-SemiBold', fontSize: 24 }} >ลากไฟล์มาวาง</p>
                          <p style={{ fontFamily: 'SukhumvitSet-SemiBold', fontSize: 24 }} >เพื่ออัพโหลดรูปภาพหลัก</p>
                          <p className="text-gray" style={{ fontFamily: 'SukhumvitSet-Bold' }} >หรือ</p>
                          <Button style={{ width: 185 }} >เลือกไฟล์จากคอมพิวเตอร์</Button>
                          <p className="text-gray" style={{ fontSize: 12 }} >อัพโหลดขนาดไฟล์ได้สูงสุด 4 MB</p>
                        </Dropzone>
                      </div>
                    </div>
                    {hasMainImage === true &&
                      <div className="col-md-6">
                        <div className="main-image">
                          <div className="image">
                            <img src={defaultValue.mainImage.preview} alt={defaultValue.mainImage.name} />
                          </div>
                          <div className="image-detail">
                            <div className="image-name">{defaultValue.mainImage.name}</div>
                            <div className="image-size">{defaultValue.mainImage.type} / {defaultValue.mainImage.size} kb</div>
                          </div>
                          <div className="image-actions clearfix" style={{ marginTop: 5 }} >
                            <div className="pull-left" style={{ width: '50%', border: '1px solid #cccccc' }} >
                              <div className="edit text-center">
                                <a onClick={() => { dropzoneRefMainImage.open() }}><Icon type="edit" /></a>
                              </div>
                            </div>
                            <div className="pull-right" style={{ width: '50%', border: '1px solid #cccccc', borderLeft: 0 }} >
                              <div className="delete text-center">
                                <a onClick={this.handleDeleteMainImage}><Icon type="delete" /></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </TabPane>
                <TabPane tab="รูปภาพประกอบ" key="2">
                  <div className="row">
                    <div className={"col-md-" + (hasImages ? 6 : 12) }>
                      <div style={{ textAlign: 'center' }} >
                        <Dropzone accept="image/jpeg, image/png, video/*" maxSize={4000000} multiple={true} name="images" ref={(node) => { dropzoneRefImages = node; }} onDrop={(accepted, rejected) => { this.setImages(accepted, rejected) }} style={dropzoneStyle} >
                          <p><Icon type="plus" style={{ fontSize: 80, color: '#cccccc' }} /></p>
                          <p style={{ fontFamily: 'SukhumvitSet-SemiBold', fontSize: 24 }} >ลากไฟล์มาวาง</p>
                          <p style={{ fontFamily: 'SukhumvitSet-SemiBold', fontSize: 24 }} >เพื่ออัพโหลดรูปภาพประกอบ</p>
                          <p className="text-gray" style={{ fontFamily: 'SukhumvitSet-Bold' }} >หรือ</p>
                          <Button style={{ width: 185 }} >เลือกไฟล์จากคอมพิวเตอร์</Button>
                          <p className="text-gray" style={{ fontSize: 12 }} >อัพโหลดขนาดไฟล์ได้สูงสุด 4 MB</p>
                          <p className="text-gray" style={{ fontSize: 12 }} >(สามารถอัพโหลดได้หลายไฟล์)</p>
                        </Dropzone>
                      </div>
                    </div>
                    {hasImages === true &&
                      <div className="col-md-6">
                        <div className="row">
                          {
                            _.map(defaultValue.images, (image, index) => {
                              return (
                                <div key={index} className="col-md-6">
                                  <div className="main-image">
                                    <div className="image">
                                      <img src={image.preview} alt={image.name} />
                                    </div>
                                    <div className="image-detail">
                                      <div className="image-name">{image.name}</div>
                                      <div className="image-size">{image.type} / {image.size} kb</div>
                                    </div>
                                    <div className="image-actions clearfix" style={{ marginTop: 5 }} >
                                      <div className="pull-left" style={{ width: '50%', border: '1px solid #cccccc' }} >
                                        <div className="edit text-center">
                                          <a onClick={() => { dropzoneRefImages.open() }}><Icon type="edit" /></a>
                                        </div>
                                      </div>
                                      <div className="pull-right" style={{ width: '50%', border: '1px solid #cccccc', borderLeft: 0 }} >
                                        <div className="delete text-center">
                                          <a onClick={() => this.handleDeleteImages(index)}><Icon type="delete" /></a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    }
                  </div>
                </TabPane>
              </Tabs>
	        	</div>
	        </div>
	      </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    defaultValue: state.sell.step2,
  };
}

const actions = {
  saveStep: SellActions.saveStep,
  prevStep: SellActions.prevStep,
  nextStep: SellActions.nextStep,
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Step2);
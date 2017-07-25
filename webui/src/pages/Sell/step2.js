import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import { Tabs, Icon, Button } from 'antd';
import * as SellActions from '../../actions/sell-actions';

const TabPane = Tabs.TabPane;

class Step2 extends Component {

  static propTypes = {
    mainImage: T.shape().isRequired,
    images: T.arrayOf().isRequired,
    actions: T.shape().isRequired,
  }

  state = {
    currentEdit: '',
  }

  setMainImage = (accepted) => {
    if (accepted.length > 0) {
      const data = {
        mainImage: {
          file: {
            contentType: accepted[0].type,
            url: accepted[0].preview,
            details: {
              size: accepted[0].size,
            },
          },
          title: accepted[0].name,
          newImage: accepted[0],
        },
      };
      const { saveStep } = this.props.actions;
      saveStep('step2', data);
    } else {
      alert('นามสกุลไฟล์ต้องเป็น jpg,png หรือ video เท่านั้น และขนาดไฟล์ไม่เกิน 4 MB');
    }
  }

  setImages = (accepted) => {
    if (accepted.length > 0) {
      const { images } = this.props;

      if (this.state.currentEdit !== '') {
        images[this.state.currentEdit] = {
          mainImage: {
            file: {
              contentType: accepted[0].type,
              url: accepted[0].preview,
              details: {
                size: accepted[0].size,
              },
            },
            title: accepted[0].name,
            newImage: accepted[0],
          },
        };
      } else {
        _.map(accepted, (accept) => {
          images.push({
            file: {
              contentType: accept.type,
              url: accept.preview,
              details: {
                size: accept.size,
              },
            },
            title: accept.name,
            newImage: accept,
          });
        });
      }

      const data = images;
      const { saveStep } = this.props.actions;
      saveStep('step2', data);

      this.setState({
        currentEdit: '',
      });
    } else {
      alert('นามสกุลไฟล์ต้องเป็น jpg,png หรือ video เท่านั้น และขนาดไฟล์ไม่เกิน 4 MB');
    }
  }

  handleDeleteMainImage = () => {
    const { defaultValue } = this.props;
    const data = {
      ...defaultValue,
      mainImage: {},
    };
    const { saveStep } = this.props.actions;
    saveStep('step2', data);
  }

  handleEditImages = (index) => {
    this.setState({
      currentEdit: index,
    });
    this.dropzoneRefImages.open();
  }

  handleDeleteImages = (index) => {
    this.deleteImages(index);
  }

  deleteImages = (index) => {
    const { defaultValue } = this.props;
    const images = defaultValue.images;
    images.splice(index, 1);
    const data = {
      ...defaultValue,
      mainImage: images,
    };
    const { saveStep } = this.props.actions;
    saveStep('step2', data);
  }

  render() {
    const { mainImage, images } = this.props;
    const hasMainImage = _.size(mainImage) > 0 ? true : false;
    const hasImages = _.size(images) > 0 ? true : false;

    const dropzoneStyle = {
      width: '100%',
      lineHeight: '40px',
      borderWidth: 2,
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRradius: 5,
      padding: '40px 0',
    };

    return (
      <div id="Step2">
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <h1>อัพโหลดรูปภาพ</h1>
              <Tabs type="card">
                <TabPane tab="รูปภาพหลัก" key="1">
                  <div className="row">
                    <div className={`col-md-${hasMainImage ? 6 : 12}`}>
                      <div style={{ textAlign: 'center' }} >
                        <Dropzone
                          accept="image/jpeg, image/png, video/*"
                          maxSize={4000000}
                          multiple={false}
                          name="mainImage"
                          ref={(node) => { this.dropzoneRefMainImage = node; }}
                          onDrop={(accepted, rejected) => { this.setMainImage(accepted, rejected); }}
                          style={dropzoneStyle}
                        >
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
                            <img src={mainImage.file.url} alt={mainImage.title} />
                          </div>
                          <div className="image-detail">
                            <div className="image-name">{mainImage.title}</div>
                            <div className="image-size">{mainImage.file.contentType} / {mainImage.file.details.size} kb</div>
                          </div>
                          <div className="image-actions clearfix" style={{ marginTop: 5 }} >
                            <div className="pull-left" style={{ width: '50%', border: '1px solid #cccccc' }} >
                              <div className="edit text-center">
                                <a role="button" tabIndex="0" onClick={() => { this.dropzoneRefMainImage.open(); }}><Icon type="edit" /></a>
                              </div>
                            </div>
                            <div className="pull-right" style={{ width: '50%', border: '1px solid #cccccc', borderLeft: 0 }} >
                              <div className="delete text-center">
                                <a role="button" tabIndex="0" onClick={this.handleDeleteMainImage}><Icon type="delete" /></a>
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
                    <div className={`col-md-${hasImages ? 6 : 12}`}>
                      <div style={{ textAlign: 'center' }} >
                        <Dropzone
                          accept="image/jpeg, image/png, video/*"
                          maxSize={4000000}
                          multiple={true}
                          name="images"
                          ref={(node) => { this.dropzoneRefImages = node; }}
                          onDrop={(accepted, rejected) => { this.setImages(accepted, rejected); }}
                          style={dropzoneStyle}
                        >
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
                            _.map(images, (image, index) => {
                              return (
                                <div key={index} className="col-md-6" draggable="true">
                                  <div className="main-image">
                                    <div className="image">
                                      <img src={image.file.url} alt={image.title} />
                                    </div>
                                    <div className="image-detail">
                                      <div className="image-name">{image.title}</div>
                                      <div className="image-size">{image.file.contentType} / {image.file.details.size} kb</div>
                                    </div>
                                    <div className="image-actions clearfix" style={{ marginTop: 5 }} >
                                      <div className="pull-left" style={{ width: '50%', border: '1px solid #cccccc' }} >
                                        <div className="edit text-center">
                                          <a role="button" tabIndex="0" onClick={() => this.handleEditImages(index)}><Icon type="edit" /></a>
                                        </div>
                                      </div>
                                      <div className="pull-right" style={{ width: '50%', border: '1px solid #cccccc', borderLeft: 0 }} >
                                        <div className="delete text-center">
                                          <a role="button" tabIndex="0" onClick={() => this.handleDeleteImages(index)}><Icon type="delete" /></a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
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

const mapStateToProps = (state) => {
  return {
    mainImage: state.sell.step2.mainImage,
    images: state.sell.step2.images,
  };
};

const actions = {
  saveStep: SellActions.saveStep,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Step2);

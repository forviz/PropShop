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
    mainImage: T.shape(),
    images: T.array,
    actions: T.shape().isRequired,
    step2: T.shape().isRequired,
  }

  state = {
    currentEdit: '',
  }

  setMainImage = (accepted) => {
    if (accepted.length > 0) {
      const data = {
        ...this.props.step2,
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
      let { images } = this.props;

      if (!_.get(images, '0.file.details.size')) {
        images = [];
      }

      if (this.state.currentEdit !== '') {
        images[this.state.currentEdit] = {
          file: {
            contentType: accepted[0].type,
            url: accepted[0].preview,
            details: {
              size: accepted[0].size,
            },
          },
          title: accepted[0].name,
          newImage: accepted[0],
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

      const data = {
        ...this.props.step2,
        images,
      };
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
    const data = {
      ...this.props.step2,
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
    const { images } = this.props;
    images.splice(index, 1);
    const data = {
      ...this.props.step2,
      images,
    };
    const { saveStep } = this.props.actions;
    saveStep('step2', data);
  }

  getParameterByName = (name, url = window.location.href) => {
    const nameReg = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${nameReg}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  render() {
    const { mainImage, images } = this.props;

    const dropzoneStyle = {
      width: '100%',
      lineHeight: '40px',
      borderWidth: 2,
      borderColor: 'rgb(102, 102, 102)',
      borderStyle: 'dashed',
      borderRradius: 5,
      padding: '40px 0',
    };

    const layout = this.getParameterByName('id') ? 'col-md-12' : 'col-md-8 col-md-offset-2';

    return (
      <div id="Step2">
        <div className="container">
          <div className="row">
            <div className={layout}>
              <h1>อัพโหลดรูปภาพ</h1>
              <Tabs type="card">
                <TabPane tab="รูปภาพหลัก" key="1">
                  <div className="row">
                    <div className={`col-md-${_.get(mainImage, 'file.details.size') ? 6 : 12}`}>
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
                    {_.get(mainImage, 'file.details.size') &&
                      <div className="col-md-6">
                        <div className="main-image">
                          <div className="image">
                            <img src={_.get(mainImage, 'file.url')} alt={_.get(mainImage, 'title')} />
                          </div>
                          <div className="image-detail">
                            <div className="image-name">{_.get(mainImage, 'title')}</div>
                            <div className="image-size">{_.get(mainImage, 'file.contentType')} / {_.get(mainImage, 'file.details.size')} kb</div>
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
                    <div className={`col-md-${_.get(images, '0.file.details.size') ? 6 : 12}`}>
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
                    {_.get(images, '0.file.details.size') &&
                      <div className="col-md-6">
                        <div className="row">
                          {
                            _.map(images, (image, index) => {
                              return (
                                <div key={index} className="col-md-6" draggable="true">
                                  <div className="main-image">
                                    <div className="image">
                                      <img src={_.get(image, 'file.url')} alt={_.get(image, 'title')} />
                                    </div>
                                    <div className="image-detail">
                                      <div className="image-name">{_.get(image, 'title')}</div>
                                      <div className="image-size">{_.get(image, 'file.contentType')} / {_.get(image, 'file.details.size')} kb</div>
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
    step2: state.sell.step2,
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

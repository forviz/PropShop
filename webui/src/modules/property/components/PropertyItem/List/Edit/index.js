import React, { Component } from 'react';
import T from 'prop-types';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import { NavLink } from 'react-router-dom';
import { Tooltip, Popconfirm } from 'antd';
import _ from 'lodash';

import { updateProperty, deleteProperty } from '../../../../actions';

class List extends Component {

  static propTypes = {
    item: T.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
      enable: props.item.enable,
    };
  }

  handleChangeStatus = () => {
    const { enable } = this.state;
    const data = {
      enable: !enable,
    };
    updateProperty(this.props.item.id, data);

    this.setState({
      enable: !enable,
    });
  }

  handleChangeStatusConfirm = () => {
    this.handleChangeStatus();
  }

  handleDeleteProperty = () => {
    deleteProperty(this.props.item.id);

    this.setState({
      item: '',
    });
  }

  render() {
    const { item, enable } = this.state;

    if (!item) return <div />;

    const imageStyle = {
      background: `url(${item.mainImage.file.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    return (
      <div className="List">
        <div className="mode-edit">
          <div className="row">
            <div className="col-md-3 vcenter">
              <div className="image" style={imageStyle} />
            </div>
            <div className="col-md-3 vcenter">
              <div className="info">
                <div className="project">{item.project || '\u00A0'}</div>
                <div className="price">{numeral(item.price).format('0,0')} บาท</div>
                <div className="place">
                  {item.province || _.get(item, 'location.summary.en') ||
                  _.get(item, 'location.summary.th') || _.get(item, 'location.full.en') ||
                  _.get(item, 'location.full.th') || '\u00A0'}
                </div>
                <div className="option">
                  <ul>
                    {item.bedroom > 0 &&
                      <li><FontAwesome name="bed" /> <span>{item.bedroom}</span> ห้องนอน</li>
                    }
                    {item.bathroom > 0 &&
                      <li><FontAwesome name="bath" /> <span>{item.bathroom}</span> ห้องน้ำ</li>
                    }
                  </ul>
                </div>
                {/*<div className="description">{item.announceDetails}</div>*/}
              </div>
            </div>
            <div className="col-md-2 vcenter">
              <div className="status">ประกาศ: {item.for}</div>
              <div className="post-date">
                <div>วันที่ประกาศ:</div>
                <div>{item.postDate}</div>
              </div>
            </div>
            <div className="col-md-2 vcenter">
              <div className="property-type">
                <div>ประเภทอสังหาฯ:</div>
                <div>{item.residentialType}</div>
              </div>
              <div className="property-status">
                <div>สถานะ:</div>
                {item.approve === true ? (
                  <Popconfirm
                    title={enable ? 'คุณต้องการปิดการใช้งาน?' : 'คุณต้องการเปิดการใช้งาน?'}
                    onConfirm={this.handleChangeStatusConfirm}
                    okText="Yes"
                    cancelText="No"
                  >
                    <a className={`label-status ${enable ? 'enable' : 'disable'}`}>
                      {enable &&
                        <FontAwesome name="check" />
                      }
                      {enable ? 'กำลังใช้งาน' : 'ปิดการใช้งาน'}
                    </a>
                  </Popconfirm>
                ) : (
                  <a className="waiting-approve">รอการอนุมัติ</a>
                )}
              </div>
            </div>
            <div className="col-md-2 vcenter">
              <div className="property-actions">
                <ul>
                  <li>
                    <Tooltip title="Preview">
                      <a href={`/#/property/${item.id}?preview=true`} target="_blank">
                        <FontAwesome name="eye" />
                      </a>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="Edit">
                      <NavLink exact to={`/account/property?id=${item.id}`}>
                        <FontAwesome name="pencil" />
                      </NavLink>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="คุณต้องการลบรายการนี้?"
                        onConfirm={this.handleDeleteProperty}
                        okText="Yes"
                        cancelText="No"
                      >
                        <a>
                          <FontAwesome name="trash" />
                        </a>
                      </Popconfirm>
                    </Tooltip>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;

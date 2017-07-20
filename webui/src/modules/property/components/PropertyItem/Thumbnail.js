import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { notification, Icon } from 'antd';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

const openNotification = () => {
  notification.open({
    message: 'บันทึกเรียบร้อย',
    description: 'รายการที่บันทึกจะอยู่ในส่วนของผู้ใช้.',
    icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
  });
};

class PropertyItem extends Component {

  render() {
    const { type, item } = this.props;

    let wished = false;
    if (!item) return (<div />);

    return (
      <div className="RealEstateItem sell">

        <NavLink exact to={`/realestate/${item.id}`}>
          <img src={`${item.mainImage}?w=180&h=180&fit=fill`} alt="" className="image" />
        </NavLink>
        <div className="content">
          <NavLink exact to={`/realestate/${item.id}`}>
            <div className="name">{item.project}</div>
          </NavLink>
          <div className="price">{numeral(item.price).format('0,0')} บาท</div>
          <div className="place">{item.street} - {item.province}</div>
          {(item.bedroom > 0 || item.bathroom > 0) &&
            <div className="option">
              <ul>
                {item.bedroom > 0 &&
                  <li><FontAwesome name="bed" /> <span>{item.bedroom}</span></li>
                }
                {item.bathroom > 0 &&
                  <li><FontAwesome name="bath" /> <span>{item.bathroom}</span></li>
                }
              </ul>
            </div>
          }

        </div>
        <FontAwesome
          onClick={() => this.handleWishList(item.id)}
          className="wishList"
          name={wished ? 'heart' : 'heart-o'}
        />
      </div>
    );
  }
}

export default PropertyItem;

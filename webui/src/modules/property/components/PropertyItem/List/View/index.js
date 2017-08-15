import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { notification, Icon } from 'antd';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

import * as WishListActions from '../../../../../../actions/wishlist-actions';

// const openNotification = () => {
//   notification.open({
//     message: 'บันทึกเรียบร้อย',
//     description: 'รายการที่บันทึกจะอยู่ในส่วนของผู้ใช้.',
//     icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
//   });
// };

class List extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    onMouseEnter: T.func,
    onMouseLeave: T.func,
  }

  handleMouseEnter = () => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.props.item);
    }
  }

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(this.props.item);
    }
  }

  render() {
    const { item } = this.props;

    if (!item) return (<div />);

    return (
      <div className="List" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="row">
          <div className="col-sm-12 col-md-3">
            <div className="image">
              <img src={item.mainImage.file.url} alt={item.project} />
            </div>
          </div>
          <div className="col-sm-12 col-md-3">
            <div className="info">
              <div className="project">{item.project || item.address}</div>
              <div className="price">{numeral(item.price).format('0,0')} บาท</div>
              <div className="place">{item.street} - {item.province}</div>
              <div className="description">{item.announceDetails}</div>
            </div>
          </div>
          <div className="col-sm-12 col-md-3">
            <div className="status">ประกาศ: {item.for}</div>
            <div className="area-size">
              <div>พื้นที่ใช้สอย:</div>
              <div>{item.areaSize} ตร.ว.</div>
            </div>
          </div>
          <div className="col-sm-12 col-md-3">
            <div className="property-type">
              <div>ประเภทอสังหาฯ:</div>
              <div>{item.residentialType}</div>
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
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wishlist: state.domain.accountWishlist.data,
    userId: state.user.data.id,
  };
};

const actions = {
  createWishlist: WishListActions.createWishlist,
  getWishlist: WishListActions.getWishlist,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);

import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import { notification, Icon } from 'antd';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import * as WishListActions from '../../actions/wishlist-actions';

// const openNotification = () => {
//   notification.open({
//     message: 'บันทึกเรียบร้อย',
//     description: 'รายการที่บันทึกจะอยู่ในส่วนของผู้ใช้.',
//     icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
//   });
// };

class Thumbnail extends Component {

  static propTypes = {
    // actions: T.shape({
    //   fetchPropertiesByAgent: T.func,
    // }).isRequired,
    item: T.shape().isRequired,
    wishlist: T.array.isRequired,
  }

  handleWishList = (itemId) => {
    // openNotification();
    // const { userId } = this.props;
    // const { createWishlist, getWishlist } = this.props.actions;
    // createWishlist(userId, itemId);
  }

  render() {
    const { item, wishlist } = this.props;

    let wished = false;
    _.map(wishlist, (value) => {
      if (value.id === item.id) wished = true;
    });

    if (!item) return (<div />);

    return (
      <div className="Thumbnail">
        <img src={item.mainImage.file.url} alt="" className="image" />
        <div className="content">
          <div className="name">{item.project}</div>
          <div className="price">{numeral(item.price).format('0,0')} บาท</div>
          <div className="place">{item.street} - {item.province}</div>
          {(item.bedroom > 0 || item.bathroom > 0) &&
            <div className="option clearfix">
              <div className="pull-left">
                <ul>
                  {item.bedroom > 0 &&
                    <li><FontAwesome name="bed" /> <span>{item.bedroom}</span></li>
                  }
                  {item.bathroom > 0 &&
                    <li><FontAwesome name="bath" /> <span>{item.bathroom}</span></li>
                  }
                </ul>
              </div>
              <div className="pull-right">
                <FontAwesome
                  onClick={() => this.handleWishList(item.id)}
                  className="wishList"
                  name={wished ? 'heart' : 'heart-o'}
                />
              </div>
            </div>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);

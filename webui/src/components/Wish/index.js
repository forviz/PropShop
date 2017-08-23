import React, { Component } from 'react';
// import T from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FontAwesome from 'react-fontawesome';
import { notification, Icon } from 'antd';

import * as WishListActions from '../../actions/wishlist-actions';

class Wish extends Component {

  // static propTypes = {
  //   actions: T.shape({
  //     deleteWishlist: T.func,
  //     createWishlist: T.func,
  //   }).isRequired,
  //   wishlist: T.shape().isRequired,
  //   user: T.shape().isRequired,
  //   item: T.shape().isRequired,
  // }

  static defaultProps = {
    isClicked: false,
  }

  state = {
    wished: false,
  }

  handleWishList = async (item, wished) => {
    if (this.props.onChange) {
      this.props.onChange(true);
    }

    await this.updateLocalStorage(item, wished);

    this.setState({
      wished: !wished,
    });

    await this.updateUserWishlist(item, wished);
  }

  updateLocalStorage = async (item, wished) => {
    const prevLocalWishlist = await localStorage.wishList;
    if (_.isEmpty(prevLocalWishlist)) {
      localStorage.wishList = await `["${item.id}"]`;
    } else {
      const { wishList } = localStorage;
      let localWishlist = '';
      if (wishList) {
        localWishlist = JSON.parse(wishList);
      }
      const indexItem = _.indexOf(localWishlist, item.id);
      if (wished || indexItem !== -1) {
        localWishlist.splice(indexItem, 1);
      } else {
        localWishlist.push(item.id);
      }
      localStorage.wishList = await JSON.stringify(localWishlist);
    }
  }

  updateUserWishlist = async (item, wished) => {
    const { user, wishlist } = this.props;
    const { createWishlist, deleteWishlist } = this.props.actions;
    const { guestId } = localStorage;

    const userId = _.isEmpty(user) ? guestId : user.id;

    if (wished) {
      await deleteWishlist(wishlist, userId, item.id);
    } else {
      createWishlist(wishlist, userId, {
        id: item.id,
        imageUrl: item.mainImage.file.url,
        area: {
          value: item.areaSize,
        },
        attributes: {
          numBathrooms: item.bathroom,
          numBedrooms: item.bedroom,
          numFloors: item.floorNo,
        },
        description: {
          th: item.announceDetails,
        },
        name: {
          th: item.topic,
        },
        price: {
          value: item.price,
          currency: 'บาท',
        },
        type: item.for,
        amphur: item.amphur,
        province: item.province,
        propertyType: item.residentialType,
      });
      notification.open({
        message: 'บันทึกเรียบร้อย',
        description: 'รายการที่บันทึกจะอยู่ในส่วนของผู้ใช้.',
        icon: <Icon type="heart" style={{ color: '#8ebc42' }} />,
      });
    }
  };

  render() {
    const { item, wishlist, user, isClicked } = this.props;
    let { wished } = this.state;

    const { wishList } = localStorage;
    let localWishlist = '';
    if (wishList) {
      localWishlist = JSON.parse(wishList);
    }

    if (item) {
      _.map(localWishlist, (value) => {
        if (value === item.id) wished = true;
      });
    }

    if (isClicked) {
      this.handleWishList(item, wished);
    }

    return (
      <FontAwesome
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          this.handleWishList(item, wished);
        }}
        className={wished ? 'Wish animation' : 'Wish'}
        name={wished ? 'heart' : 'heart-o'}
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wishlist: state.domain.accountWishlist.data,
    user: state.user.data,
    fetching: state.domain.accountWishlist.fetching,
  };
};

const actions = {
  createWishlist: WishListActions.createWishlist,
  deleteWishlist: WishListActions.deleteWishlist,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wish);

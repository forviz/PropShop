import React, { Component } from 'react';
import { Input, Alert, Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import WishItem from '../../../components/WishItem';

import * as WishListActions from '../../../actions/wishlist-actions';

class WishList extends Component {

  componentDidMount() {
    const { createWishlist, getWishlist } = this.props.actions;
    const { user } = this.props;
    const wishList = JSON.parse(localStorage.wishList);
    // _.map(wishList, (value,key) => {
    //   createWishlist('R1qSQRWv9LRpCjBGD1tsGfgFupm1', key);
    // });
    console.log('USERID', user);
    getWishlist(user.id);
  }

  render() {
    const wishList = JSON.parse(localStorage.wishList);
    const { items, history } = this.props;

    return (
      <div id="WishList">
        <div className="container">
          <div className="row">
            <div className="head"> รายการที่บันทึกไว้ </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <WishItem items={items} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.domain.accountWishlist.data,
    user: state.user.data,
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

export default connect(mapStateToProps, mapDispatchToProps)(WishList);


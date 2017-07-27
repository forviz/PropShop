import React, { Component } from 'react';
// import T from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FontAwesome from 'react-fontawesome';

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

  state = {
    wished: false,
  }

  componentDidMount = async () => {
    // await this.setLocaleWishlist();
  }

  handleWishList = async (item, wished) => {
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
      const localWishlist = JSON.parse(localStorage.wishList);
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
      await createWishlist(wishlist, userId, {
        id: item.id,
        imageUrl: item.images[0],
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
          currency: 'baht',
        },
        type: item.for,
        amphur: item.amphur,
        province: item.province,
        propertyType: item.residentialType,
      });
    }
  };

  render() {
    const { item, wishlist, user } = this.props;
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

    return (
      <FontAwesome
        onClick={() => this.handleWishList(item, wished)}
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

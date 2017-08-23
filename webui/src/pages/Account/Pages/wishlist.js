import React, { Component } from 'react';
// import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from 'antd';
import _ from 'lodash';

import WishItem from '../../../components/WishItem';

import * as WishListActions from '../../../actions/wishlist-actions';

class WishList extends Component {

  // static propTypes = {
  //   // actions: T.shape({
  //   //   getWishlist: T.func,
  //   //   updateWishlist: T.func,
  //   //   deleteWishlist: T.func,
  //   // }),
  //   wishlist: T.shape().isRequired,
  //   fetching: T.bool.isRequired,
  // }

  componentDidMount = async () => {
    const { getWishlist, updateWishlist } = this.props.actions;
    const { user, wishlist } = this.props;
    const { guestId } = localStorage;
    await updateWishlist(guestId, user.id);
    if (_.isEmpty(wishlist)) {
      await getWishlist(user.id);
    }
    // await getWishlist(user.id);
  }

  handleDelete = async (propertyId) => {
    this.setState({ focus: propertyId });
    const localWishlist = JSON.parse(localStorage.wishList);
    const indexItem = _.indexOf(localWishlist, propertyId);
    if (indexItem !== -1) {
      localWishlist.splice(indexItem, 1);
    }
    localStorage.wishList = JSON.stringify(localWishlist);

    const { deleteWishlist } = this.props.actions;
    const { user, wishlist } = this.props;
    await deleteWishlist(wishlist, user.id, propertyId);
  }

  render() {
    const { wishlist, fetching } = this.props;

    return (
      <div id="WishList">
        <div className="row">
          <div className="col-md-12">
            <div className="layout-right">
              <Spin tip="Loading..." spinning={fetching}>
                <div className="layout-container">
                  <div className="topic">
                    <h1>รายการที่บันทึกไว้</h1>
                  </div>
                  <div className="wishlist-list">
                    {
                      _.map(wishlist, (wish) => {
                        return <WishItem item={wish} onDelete={this.handleDelete} />;
                      })
                    }
                  </div>
                </div>
              </Spin>
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
    user: state.user.data,
    fetching: state.domain.accountWishlist.fetching,
  };
};

const actions = {
  getWishlist: WishListActions.getWishlist,
  updateWishlist: WishListActions.updateWishlist,
  deleteWishlist: WishListActions.deleteWishlist,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishList);

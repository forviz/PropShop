import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as WishListActions from '../../actions/wishlist-actions';

class WishItem extends Component {

  handleView = (propertyId) => {
    this.props.history.push(`/realestate/${propertyId}`)
  }

  handleDelete = (entryId) => {
    console.log('DELETE ', entryId)
    const { deleteWishlist } = this.props.actions;
    const { user } = this.props
    console.log('handledeleteuserid',user)
    deleteWishlist(user.id, entryId)
  }

  render() {

    const { items } = this.props;
    
    return (
      <div className="row">
        {
          _.map(items, (item, key) => {
            return (
              <div className="WishItem col-md-12">
                <img src={item.imageUrl} alt="" className="image col-md-2" onClick={() => this.handleView(item.entryId)}/>
                <div className="detail col-md-3">
                  <div className="title" onClick={() => this.handleView(item.entryId)}>{item.name.th}</div>
                  <div className="description">{item.description.th}</div>
                </div>
                <div className="status col-md-3">
                  สถานะ: <br/> {item.type}
                  <br/><br/>
                  <FontAwesome name='bed'/> {item.attributes.numBedrooms} ห้องนอน<br/>
                  <FontAwesome name='bath'/> {item.attributes.numBathrooms} ห้องน้ำ
                </div>
                <div className="space col-md-3">
                  พื้นที่: <br/> {item.area.value} {item.area.unit}
                  <br/><br/>
                  ราคา: <br/> {item.price.value} {item.price.currency}
                </div>
                <div className="option col-md-1">
                  <button className="view" onClick={() => this.handleView(item.entryId)}>
                    <FontAwesome
                      name='eye'
                    />
                  </button>
                  <button className="delete" onClick={() => this.handleDelete(item.entryId)}>
                    <FontAwesome
                      name='remove'
                    />
                  </button>
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // items: state.domain.wishlist.data,
    user: state.user.data,
  };
};

const actions = {
  deleteWishlist: WishListActions.deleteWishlist,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WishItem);

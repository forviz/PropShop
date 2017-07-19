import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Button, notification, Icon } from 'antd';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import * as WishListActions from '../../actions/wishlist-actions';

const openNotification = () => {
  notification.open({
    message: 'บันทึกเรียบร้อย',
    description: 'รายการที่บันทึกจะอยู่ในส่วนของผู้ใช้.',
    icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
  });
};

class RealEstateItem extends Component {

  // state = {
  //   wishList: {},
  // }
  handleWishList = (itemId) => {
    openNotification();
    // LOCAL STORAGE
    // if(_.isEmpty(localStorage.wishList)){
    //   localStorage.wishList = `["${itemId}"]`
    // }else{
    //   let wishList = JSON.parse(localStorage.wishList);
    //   const indexItem = _.indexOf(wishList,itemId);
    //   (indexItem !== -1) ? wishList.splice(indexItem,1) : wishList.push(itemId);
    //   localStorage.wishList = JSON.stringify(wishList)
    //   this.setState({
    //     wishList: JSON.parse(localStorage.wishList),
    //   })
    // }

    const { userId } = this.props
    const { createWishlist, getWishlist } = this.props.actions
    createWishlist(userId, itemId);
    //const { userId } = this.props
    //const wishList = JSON.parse(localStorage.wishList);
    // _.map(wishList, (value,key) => {
    //   createWishlist(userId, key);
    // });
    
  }

  // componentDidMount() {
  //   this.getWishList()
  // }

  // getWishList = () => {
  //   const wishList = JSON.parse(localStorage.wishList);
  //   this.setState({
  //     wishList,
  //   })
  // }


  render() {
    const { type, item, wishlist } = this.props;
    //const { wishList } = this.state;

    console.log('www',item)

    let wished = false;
    _.map(wishlist, (value) => {
      if (value.id === item.id) wished = true;
    });

    if (!item) return (<div />);

    const background = {
      background: `url(${item.mainImage}?h=150&fit=fill)`,
      backgroundSize: 'cover',
    };

    if (type === 'detail') {
      return (
        <div className="RealEstateItem detail">
          <div className="row">
            <div className="col-md-3">
              <div className="image">
                <img src={`${item.mainImage}`} alt={item.project} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="address">{item.street} - {item.province}</div>
              {(item.bedroom > 0 || item.bathroom > 0) &&
                <div className="option">
                  <ul>
                    {item.bedroom > 0 &&
                      <li><FontAwesome name="bed" /><span>{item.bedroom}</span></li>
                    }
                    {item.bathroom > 0 &&
                      <li><FontAwesome name="bath" /><span>{item.bathroom}</span></li>
                    }
                  </ul>
                </div>
              }
              <div style={{ marginTop: '15px' }}>
                {item.soldOut === 1 &&
                  <span className="for sold_out">ขายแล้ว</span>
                }
                {item.soldOut === 0 && item.type === 'sell' &&
                  <span className="for sell">สำหรับขาย</span>
                }
                {item.soldOut === 0 && item.type === 'rent' &&
                  <span className="for rent">สำหรับเช่า</span>
                }
              </div>
            </div>
            <div className="col-md-3">
              <div className="price">{numeral(item.price).format('0,0')} บาท</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="RealEstateItem sell">
        
        <NavLink exact to={`/realestate/${item.id}`}>
          <img src={item.mainImage} alt="" className="image" />
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
          name={ wished ? 'heart' : 'heart-o'}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(RealEstateItem);

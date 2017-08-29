import React, { Component } from 'react';
import T from 'prop-types';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import { Tooltip, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import { fetchDeleteWishlist } from '../../../../../../api/wishlist';

class Wishlist extends Component {

  static propTypes = {
    item: T.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      item: props.item,
    };
  }

  handleDeleteWishlist = async () => {
    const { propertyId } = this.props.item.id;
    const localWishlist = JSON.parse(localStorage.wishList);
    const indexItem = _.indexOf(localWishlist, propertyId);
    if (indexItem !== -1) {
      localWishlist.splice(indexItem, 1);
    }
    localStorage.wishList = JSON.stringify(localWishlist);

    const { user } = this.props;
    fetchDeleteWishlist(user.id, propertyId);

    this.setState({
      item: '',
    });
  }

  render() {
    const { item } = this.state;

    if (!item) return <div />;

    const imageStyle = {
      background: `url(${item.mainImage.file.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    return (
      <div className="List">
        <div className="mode-wishlist">
          <div className="row">
            <div className="col-sm-12 col-md-3 vcenter">
              <div className="image" style={imageStyle} />
            </div>
            <div className="col-sm-12 col-md-5 vcenter">
              <div className="info">
                <div className="project">{item.project || '\u00A0'}</div>
                <div className="property-type">{item.residentialType}</div>
                <div className="price">{numeral(item.price).format('0,0')} บาท</div>
                <div className="place">
                  {item.province || _.get(item, 'location.summary.en') ||
                  _.get(item, 'location.summary.th') || _.get(item, 'location.full.en') ||
                  _.get(item, 'location.full.th') || '\u00A0'}
                </div>
                {/*<div className="description">{item.announceDetails}</div>*/}
              </div>
            </div>
            <div className="col-sm-12 col-md-3 vcenter">
              <div className="info">
                <div className="status">ประกาศ: {item.for}</div>
                <div className="area-size">
                  <div>พื้นที่: {item.areaSize} ตร.ว.</div>
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
            <div className="col-md-1 vcenter">
              <div className="wishlist-actions">
                <ul>
                  <li>
                    <Tooltip title="Preview">
                      <a href={`/#/property/${item.id}?preview=true`} target="_blank">
                        <FontAwesome name="eye" />
                      </a>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip title="Delete">
                      <Popconfirm
                        title="คุณต้องการลบรายการนี้?"
                        onConfirm={this.handleDeleteWishlist}
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

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
  };
};

const actions = {};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);

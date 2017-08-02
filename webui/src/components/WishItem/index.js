import React, { Component } from 'react';
// import T from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { NavLink } from 'react-router-dom';

import numeral from 'numeral';

class WishItem extends Component {

  // static propTypes = {
  //   onDelete: T.func().isRequired,
  //   item: T.shape().isRequired,
  // }

  render() {
    const { item, onDelete } = this.props;

    if (_.isEmpty(item)) {
      return <div />;
    }

    return (
      <div className="WishItem col-xs-12">
        <NavLink exact to={`/property/${item.id}`}>
          <img src={_.get(item, 'imageUrl')} alt="" className="image" />
        </NavLink>
        <div className="detail col-xs-2 col-md-3">
          <NavLink exact to={`/property/${item.id}`}>
            <div className="title" title={_.get(item, 'name.th')}>{_.get(item, 'name.th')}</div>
          </NavLink>
          <div className="price">{numeral(_.get(item, 'price.value')).format('0,0')} {_.get(item, 'price.currency')}</div>
          <div className="place">{_.get(item, 'amphur')} - {_.get(item, 'province')}</div>
          <div className="description" title={_.get(item, 'description.th')}>{_.get(item, 'description.th')}</div>
        </div>
        <div className="status col-xs-2 col-md-3">
          ประกาศ: <br /> {_.get(item, 'type')} <br />
          <br />
          พื้นที่ใช้สอย:<br /> {_.get(item, 'area.value')} {_.get(item, 'area.unit')}
        </div>
        <div className="status col-xs-2 col-md-3">
          ประเภทอสังหาฯ:<br />
          {_.get(item, 'propertyType')}<br />
          <br />
          <FontAwesome name="bed" /> {_.get(item, 'attributes.numBedrooms')} ห้องนอน<br />
          <FontAwesome name="bath" /> {_.get(item, 'attributes.numBathrooms')} ห้องน้ำ
        </div>
        <div className="option">
          <div className="view">
            <NavLink exact to={`/property/${item.id}`}>
              <button>
                <FontAwesome
                  name="eye"
                />
              </button>
            </NavLink>
          </div>
          {onDelete &&
            <div className="delete">
              <button onClick={() => onDelete(item.id)}>
                <FontAwesome
                  name="remove"
                />
              </button>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default WishItem;

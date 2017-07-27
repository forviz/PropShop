import React, { Component } from 'react';
import T from 'prop-types';
import { NavLink } from 'react-router-dom';

import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

class PropertyItem extends Component {

  static propTypes = {
    item: T.object,
    onMouseEnter: T.func,
    onMouseLeave: T.func,
  }

  handleMouseEnter = (e) => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.props.item);
    }
  }

  handleMouseLeave = (e) => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(this.props.item);
    }
  }

  render() {
    const { type, item } = this.props;

    if (!item) return (<div />);

    return (
      <div className="RealEstateItem sell" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <NavLink exact to={`/realestate/${item.id}`}>
          <img src={`${item.mainImage}?w=180&h=180&fit=fill`} alt="" className="image" />
        </NavLink>
        <div className="content">
          <NavLink exact to={`/realestate/${item.id}`}>
            <div className="name" title={item.topic}>{item.topic}</div>
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
      </div>
    );
  }
}

export default PropertyItem;

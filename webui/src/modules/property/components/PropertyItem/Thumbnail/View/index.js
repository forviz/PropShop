import React, { Component } from 'react';
import T from 'prop-types';

import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

import Wish from '../../../../../../components/Wish';

class Thumbnail extends Component {

  static propTypes = {
    item: T.shape().isRequired,
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
    const { item } = this.props;

    // let wished = false;
    if (!item) return (<div />);

    return (
      <div className="Thumbnail" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <img src={`${item.mainImage}?w=180&h=180&fit=fill`} alt={item.project} className="image" />
        <div className="content">
          <div className="name">{item.project}</div>
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
        <div className="wish">
          <Wish item={item} />
        </div>
      </div>
    );
  }
}

export default Thumbnail;

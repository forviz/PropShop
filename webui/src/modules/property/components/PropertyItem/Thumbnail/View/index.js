import React, { Component } from 'react';
import T from 'prop-types';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import Wish from '../../../../../../components/Wish';

class Thumbnail extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    onMouseEnter: T.func,
    onMouseLeave: T.func,
  }

  handleMouseEnter = () => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.props.item);
    }
  }

  handleMouseLeave = () => {
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(this.props.item);
    }
  }

  render() {
    const { item } = this.props;

    if (!item) return <div />;

    const imageStyle = {
      background: `url(${item.mainImage.file.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    return (
      <div className="Thumbnail" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="image" style={imageStyle} />
        <div className="content">
          <div className="name">{item.project || '\u00A0'}</div>
          <div className="price">{numeral(item.price).format('0,0')} บาท</div>
          <div className="place">{item.province || _.get(item, 'location.summary.en') ||
            _.get(item, 'location.summary.th') || _.get(item, 'location.full.en') ||
            _.get(item, 'location.full.th') || '\u00A0'}</div>
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

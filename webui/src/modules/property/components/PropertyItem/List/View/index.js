import React, { Component } from 'react';
import T from 'prop-types';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import Wish from '../../../../../../components/Wish';

class List extends Component {

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
      <div className="List" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        <div className="row">
          <div className="col-sm-12 col-md-3 vcenter">
            <div className="image" style={imageStyle} />
          </div>
          <div className="col-sm-12 col-md-6 vcenter">
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
        </div>
        <div className="wish">
          <Wish item={item} />
        </div>
      </div>
    );
  }
}

export default List;

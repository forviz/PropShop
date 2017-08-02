import React, { Component } from 'react';
import T from 'prop-types';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

class List extends Component {

  static propTypes = {
    item: T.shape().isRequired,
  }

  render() {
    const { item } = this.props;

    if (!item) return <div />;

    console.log('item', item);

    return (
      <div className="List">
        <div className="row">
          <div className="col-md-3 vcenter">
            <div className="image">
              <img src={item.mainImage.file.url} alt={item.project} />
            </div>
          </div>
          <div className="col-md-3 vcenter">
            <div className="info">
              <div className="project">{item.project || item.address}</div>
              <div className="price">{numeral(item.price).format('0,0')} บาท</div>
              <div className="place">{item.street} - {item.province}</div>
              <div className="description">{item.announceDetails}</div>
            </div>
          </div>
          <div className="col-md-3 vcenter">
            <div className="status">ประกาศ: {item.for}</div>
            <div className="post-date">
              <div>วันที่ประกาศ:</div>
              <div>{item.postDate}</div>
            </div>
          </div>
          <div className="col-md-3 vcenter">
            <div className="property-type">
              <div>ประเภทอสังหาฯ:</div>
              <div>{item.residentialType}</div>
            </div>
            <div className="property-status">
              <div>สถานะ:</div>
              <div>{item.enable}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;

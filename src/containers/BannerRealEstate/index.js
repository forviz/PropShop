import React, { Component } from 'react';
import numeral from 'numeral';
import _ from 'lodash';
import ImageGallery from 'react-image-gallery';
import FontAwesome from 'react-fontawesome';

import realEstateData from '../../../public/data/realEstateData.json';


class BannerRealEstate extends Component {

	renderSlide = (item) => {

    const backgroundStyle = {
      'background': `url(${item.mainImage})`,
      'backgroundSize': 'cover',
    }

    return (
      <div className="image-gallery-image" style={backgroundStyle}>
        <div className="image-gallery-gradient"></div>  
        <div className="image-gallery-description">
          <div className="price">{numeral(item.price).format('0,0')} บาท</div>
          <div className="place">{item.address.street} - {item.address.province}</div>
          <div className="option clearfix">
            <ul>
              <li><FontAwesome name="bed" /><span>{item.room.bedroom}</span></li>
              <li><FontAwesome name="bath" /><span>{item.room.bathroom}</span></li>
            </ul>
          </div>
         </div>
      </div>
    );
  }

  render() {

    const realEstateDatas = _.filter(realEstateData, (value) => { 
      return value.id === 15 || value.id === 16 || value.id === 17 || value.id === 18; 
    });

    return (
      <div className="BannerRealEstate">
        <ImageGallery
          items={realEstateDatas}
          slideInterval={2000}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          showNav={false}
          showBullets={true}
          renderItem={this.renderSlide}
        />
      </div>
    );
  }
}

export default BannerRealEstate;

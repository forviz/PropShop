import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';
import FontAwesome from 'react-fontawesome';
import numeral from 'numeral';

import _ from 'lodash';

class NewsItem extends Component {

  renderSlide = (data) => {
    const backgroundStyle = {
      'background-image': `url(${data.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.5,
    };

    return (
      <div className="banner" >
        <div className="image-dark" style={backgroundStyle}></div>
        <div className="content">
          <div className="title">{data.title}</div>
          <div className="description">{data.description}</div>
          <a href={data.redirectURL}><button className="btn btn-primary" onClick={this.submit} >อ่านเพิ่มเติม</button></a>
        </div>
        
      </div>
    );
  }

  render() {
    const { datas } = this.props;

    return (
      <div className="NewsBanner">
        <ImageGallery
          items={datas}
          slideInterval={2000}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          showNav={false}
          showBullets
          renderItem={this.renderSlide}
        />
      </div>
    );
  }
}

export default NewsItem;

import React, { Component } from 'react';
import ImageGallery from 'react-image-gallery';

import _ from 'lodash';

function strip(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

class NewsItem extends Component {

  renderSlide = (data) => {
    const backgroundStyle = {
      backgroundImage: `url(${data.acf.banner_images.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };

    const title = strip(data.title.rendered);
    // const description = strip(data.acf.content);

    return (
      <div className="banner" style={backgroundStyle}>
        <a href={data.link} target="_blank"><div className="image-dark" /></a>
        <div className="content">
          <a href={data.link} target="_blank"><div className="title">{title}</div></a>
          {
            // <div className="description">{description}</div>
            // <a href={data.link} target="_blank"><button className="btn btn-primary" onClick={this.submit} >อ่านเพิ่มเติม</button></a>
          }
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
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          showBullets
          renderItem={this.renderSlide}
        />
      </div>
    );
  }
}

export default NewsItem;

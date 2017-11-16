import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import numeral from 'numeral';
import ImageGallery from 'react-image-gallery';
import FontAwesome from 'react-fontawesome';

import * as BannerActions from '../../actions/banner-actions';

class BannerRealEstate extends Component {

  constructor(props) {
    super(props);
    const { fetchBanners } = this.props.actions;
    fetchBanners();
  }

  renderSlide = (item) => {
    const backgroundStyle = {
      background: `url(${item.mainImage.file.url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    return (
      <NavLink exact to={`/property/${item.id}`}>
        <div className="image-gallery-image" style={backgroundStyle}>
          <div className="image-gallery-gradient" />
          <div className="image-gallery-description">
            {item.topic &&
              <div className="topic">{item.topic}</div>
            }
            <div className="price">{numeral(item.price).format('0,0')} บาท</div>
            <div className="place">{item.province}</div>
            <div className="option clearfix">
              <ul>
                <li><FontAwesome name="bed" /><span>{item.bedroom}</span></li>
                <li><FontAwesome name="bath" /><span>{item.bathroom}</span></li>
              </ul>
            </div>
          </div>
        </div>
      </NavLink>
    );
  }

  render() {
    const { banners, loading } = this.props;

    if (loading === true) return <Spin />;

    return (
      <div className="BannerRealEstate">
        <ImageGallery
          items={banners}
          slideInterval={2000}
          showThumbnails={false}
          showFullscreenButton={false}
          showPlayButton={false}
          showNav={false}
          showBullets={true}
          autoPlay={true}
          slideInterval={5000}
          renderItem={this.renderSlide}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.banners.loading,
    banners: state.banners.main,
  };
};

const actions = {
  fetchBanners: BannerActions.fetchBanners,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BannerRealEstate);

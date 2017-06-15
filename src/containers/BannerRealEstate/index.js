import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin } from 'antd';
import numeral from 'numeral';
import _ from 'lodash';
import ImageGallery from 'react-image-gallery';
import FontAwesome from 'react-fontawesome';

import * as BannerActions from '../../actions/banner-actions';

class BannerRealEstate extends Component {

  // componentWillReceiveProps (nextProps) {
  //   this.setState({
  //     value: nextProps.initialValue,
  //   })
  // }

  componentDidMount() {
    const { fetchBanners } = this.props.actions;
    fetchBanners();
  }

	renderSlide = (item) => {

    const backgroundStyle = {
      'background': `url(${item.mainImage})`,
      'backgroundSize': 'cover',
      'backgroundPosition': 'center',
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
          renderItem={this.renderSlide}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.banners.loading,
    banners: state.banners.main,
    // banners: _.map(state.banners.main, (bannerId) => {
    //   const property = state.banners.entities[bannerId];
    //   return {
    //     mainImage: property.mainImage.fields.file.url,
    //     price: property.price,
    //     address: {
    //       street: property.street,
    //       province: property.province,
    //     },
    //     room: {
    //       bedroom: property.bedroom,
    //       bathroom: property.bathroom,
    //     },
    //   }
    // }),
  };
}

const actions = {
  fetchBanners: BannerActions.fetchBanners,
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BannerRealEstate);
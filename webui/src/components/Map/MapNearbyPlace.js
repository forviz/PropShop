import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';

import { getNearbySearch, getDistances } from '../../api/map';

// const MarkerWithLabel = require('markerwithlabel')(google.maps);

const typeList = [
  { key: 'school', name: 'School' },
  { key: 'bank', name: 'Bank' },
  { key: 'hospital', name: 'Hospital' },
  { key: 'shopping_mall', name: 'Shopping' },
  { key: 'train_station', name: 'Transport' },
];

class MapNearbyPlace extends Component {

  static defaultProps = {
    lat: 13.7248946,
    lng: 100.4930246,
    radius: 1000,
  }

  state = {
    loading: true,
    currentSelect: 'school',
    results: [],
  }

  componentDidMount() {
    const { currentSelect } = this.state;
    this.fetchNearbyPlace(currentSelect);
  }

  // getDistance = async (desLat, desLng) => {
  //   const { lat, lng } = this.props;
  //   const url = `//maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.REACT_APP_APIKEY}&origins=${lat},${lng}&destinations=${desLat},${desLng}`;
  //   const result = await fetch(url);
  //   const resultJSON = await result.json();
  //   return resultJSON;
  // }

  setNearbyData = async (type, data) => {
    const { lat, lng } = this.props;
    const distancesData = await getDistances(lat, lng, data);
    // const newData = await Promise.all(data.map(async (value) => {
    //   const distance = await this.getDistance(value.geometry.location.lat, value.geometry.location.lng);
    //   return {
    //     ...value,
    //     distance: distance.rows[0].elements[0].distance.text,
    //   };
    // }));
    this.setState({
      loading: false,
      results: distancesData.data,
    }, () => {
      this.initializeMap(type);
    });
  }

  map;
  infowindow;

  handleType = (key) => {
    this.setState({
      currentSelect: key,
    });
    this.fetchNearbyPlace(key);
  }

  fetchNearbyPlace = async (type) => {

    this.setState({
      loading: true,
    });

    const { lat, lng, radius } = this.props;
    const nearbySearch = await getNearbySearch(lat, lng, radius, type);
    this.setNearbyData(type, nearbySearch.data.results);
    // const url = `//maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.REACT_APP_APIKEY}`;
    // fetch(url)
    // .then((response) => {
    //   if (response.status !== 200) {
    //     return false;
    //   }
    //   response.json().then((data) => {
    //     this.setNearbyData(type, data.results);
    //   });
    //   return true;
    // },
    // )
    // .catch((err) => {
    //   console.log('Fetch Error :-S', err);
    // });
  }

  /* global google */
  initializeMap = (type) => {
    const center = new google.maps.LatLng(this.props.lat, this.props.lng);

    const _self = this;

    this.map = new google.maps.Map(this.map, {
      center,
      zoom: 15,
    });

    this.infowindow = new google.maps.InfoWindow();
    let marker;

    marker = new google.maps.Marker({
      position: center,
      map: _self.map,
      icon: 'images/googlemap/marker/default.png',
    });

    _.forEach(this.state.results, (value, key) => {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(value.geometry.location.lat, value.geometry.location.lng),
        map: _self.map,
        icon: `images/googlemap/marker/${type}.png`,
      });

      _.set(this.state.results[key], 'marker', marker);

      google.maps.event.addListener(marker, 'mouseover', ((mark) => {
        return () => {
          _self.infowindow.setContent(value.name);
          _self.infowindow.open(_self.map, mark);
        };
      })(marker, key));
    });

    this.setState({
      results: this.state.results,
    });
  }

  handleHoverNearbyPlace = (label, marker) => {
    this.infowindow.setContent(label);
    this.infowindow.open(this.map, marker);
  }

  render() {
    const { currentSelect, results, loading } = this.state;

    return (
      <div className="NearbyPlace">
        <div className="row">
          <div className="col-md-6">
            <div className="place-list">
              <div className="tabs-block">
                {
                  _.map(typeList, (list, index) => {
                    return (
                      <div
                        role="button"
                        tabIndex="0"
                        key={index}
                        className={`type ${list.key === currentSelect ? 'active' : ''}`}
                        onClick={() => this.handleType(list.key)}
                      >
                        <div className="item">
                          <div className={`icon icon-${list.key}`} />
                          <div className="text">{list.name}</div>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
              <div className="result-lists">
                {loading === true ? (
                  <center><Spin /></center>
                ) : (
                  <div>
                    {_.size(results) > 0 ? (
                      _.map(results, (result, index) => {
                        return (
                          <div key={index} className="clearfix" onMouseEnter={() => this.handleHoverNearbyPlace(result.name, result.marker)}>
                            <div className="pull-left">{result.name}</div>
                            <div className="pull-right">{result.distance}</div>
                          </div>
                        );
                      })
                    ) : (
                      <center>ไม่พบข้อมูล</center>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="place-map">
              <div ref={c => this.map = c} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MapNearbyPlace;

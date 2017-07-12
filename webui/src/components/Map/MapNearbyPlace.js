import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';

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

  getDistance = async (desLat, desLng) => {
    const { lat, lng } = this.props;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${process.env.REACT_APP_APIKEY}&origins=${lat},${lng}&destinations=${desLat},${desLng}`;
    const result = await fetch(url);
    const resultJSON = await result.json();
    return resultJSON;
  }

  setNearbyData = async (data) => {
    const newData = await Promise.all(data.map(async (value) => {
      const distance = await this.getDistance(value.geometry.location.lat, value.geometry.location.lng);
      return {
        ...value,
        distance: distance.rows[0].elements[0].distance.text,
      };
    }));

    this.setState({
      loading: false,
      results: newData,
    }, () => {
      this.initializeMap();
    });
  }

  handleType = (key) => {
    this.setState({
      currentSelect: key,
    });
    this.fetchNearbyPlace(key);
  }

  fetchNearbyPlace = (type) => {

    this.setState({
      loading: true,
    });

    const { lat, lng, radius } = this.props;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}$key=${process.env.REACT_APP_APIKEY}`;
    fetch(url)
    .then((response) => {
      if (response.status !== 200) {
        return false;
      }
      response.json().then((data) => {
        this.setNearbyData(data.results);
      });
      return true;
    },
    )
    .catch((err) => {
      console.log('Fetch Error :-S', err);
    });
  }

  /*global google */
  initializeMap = () => {
    const center = new google.maps.LatLng(this.props.lat, this.props.lng);

    const map = new google.maps.Map(this.map, {
      center,
      zoom: 15,
    });

    const infowindow = new google.maps.InfoWindow();
    let marker;

    marker = new google.maps.Marker({
      position: center,
      map,
      icon: 'images/static/googlemap/marker.png',
    });

    _.forEach(this.state.results, (value, key) => {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(value.geometry.location.lat, value.geometry.location.lng),
        map,
      });

      google.maps.event.addListener(marker, 'click', ((mark) => {
        return () => {
          infowindow.setContent(value.name);
          infowindow.open(map, mark);
        };
      })(marker, key));
    });

    marker.setMap(map);
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
                      <div role="button" tabIndex="0" key={index} className={"type " + (list.key === currentSelect ? 'active' : '')} onClick={() => this.handleType(list.key)} >
                        <div className="item">
                          <div className={"icon icon-"+list.key}></div>
                          <div className="text">{list.name}</div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className="result-lists">
                {loading === true ? (
                  <center><Spin /></center>
                ) : (
                  <div>
                    {
                      _.map(results, (result, index) => {
                        return (
                          <div key={index} className="clearfix">
                            <div className="pull-left">{result.name}</div>
                            <div className="pull-right">{result.distance}</div>
                          </div>
                        )
                      })
                    }
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

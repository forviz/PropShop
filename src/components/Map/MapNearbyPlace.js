import React, { Component } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import _ from 'lodash';

const typeList = [
  { key: 'school', name: 'School' },
  { key: 'bank', name: 'Bank' },
  { key: 'hospital', name: 'Hospital' },
  { key: 'shopping_mall', name: 'Shopping' },
  { key: 'train_station', name: 'Transport' },
]

class MapNearbyPlace extends Component {

  constructor(props) {
    super(props);
  }

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

  handleType = (key) => {
    this.setState({
      currentSelect: key,
    });
    this.fetchNearbyPlace(key);
  }

  getDistance = async (desLat, desLng) => {
    const { lat, lng } = this.props;
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?key='+process.env.REACT_APP_APIKEY+'&origins='+lat+','+lng+'&destinations='+desLat+','+desLng;
    const result = await fetch(url); 
    const resultJSON = await result.json();
    return resultJSON;
  }

  setNearbyData = async (data) => {
    const newData = await Promise.all(data.map(async (value, index) => {
      const distance = await this.getDistance(value.geometry.location.lat, value.geometry.location.lng);
      return {
        ...value,
        distance: distance.rows[0].elements[0].distance.text,
      }
    }));

    this.setState({
      loading: false,
      results: newData,
    }, () => {
      this.initializeMap();
    });
  }

  fetchNearbyPlace = (type) => {

    this.setState({
      loading: true,
    });

    const { lat, lng, radius } = this.props;
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius='+radius+'&type='+type+'&key='+process.env.REACT_APP_APIKEY;
    
    fetch(url)  
    .then((response) => {  
        if (response.status !== 200) {  
          console.log('Looks like there was a problem. Status Code: ' +  
            response.status);  
          return;  
        }
        response.json().then((data) => {
          this.setNearbyData(data.results);
        });  
      }  
    )  
    .catch(function(err) {  
      console.log('Fetch Error :-S', err);  
    });
  }

  /*global google */
  initializeMap = () => {

    const center = new google.maps.LatLng(this.props.lat, this.props.lng);

    const map = new google.maps.Map(this.map, {
      center: center,
      zoom: 15,
    });

    let infowindow = new google.maps.InfoWindow();
    let marker;

    marker = new google.maps.Marker({
      position: center,
      map: map,
      icon: 'images/static/googlemap/marker.png',
    });

    _.forEach(this.state.results, function(value, key) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(value.geometry.location.lat, value.geometry.location.lng),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, key) {
        return function() {
          infowindow.setContent(value.name);
          infowindow.open(map, marker);
        }
      })(marker, key));
    });

    marker.setMap(map);
  }

  componentDidMount() {
    const { currentSelect } = this.state;
    this.fetchNearbyPlace(currentSelect);
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
                      <div key={index} className={"type " + (list.key === currentSelect ? 'active' : '')} onClick={() => this.handleType(list.key)} >
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
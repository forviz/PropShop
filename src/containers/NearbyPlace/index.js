import React, { Component } from 'react';
import { Spin } from 'antd';
import { withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import withScriptjs from "react-google-maps/lib/async/withScriptjs";
import _ from 'lodash';

const spinDiv = <Spin />

const typeList = [
  { key: 'school', name: 'School' },
  { key: 'bank', name: 'Bank' },
  { key: 'hospital', name: 'Hospital' },
  { key: 'shopping_mall', name: 'Shopping' },
  { key: 'train_station', name: 'Transport' },
]

const AsyncGettingStartedExampleGoogleMap = withScriptjs(
  withGoogleMap((props) => {
    return (
      <GoogleMap
        ref={props.onMapLoad}
        zoom={props.zoom}
        center={props.center}
        onClick={props.onMapClick}
      >
        {props.markers.map(marker => (
          <Marker
            {...marker}
            onClick={() => props.onMarkerClick(marker)}
          />
        ))}
      </GoogleMap>
    )
  })
);

class NearbyPlace extends Component {

  static defaultProps = {
    lat: 13.7248946,
    lng: 100.4930246,
    radius: 1000,
  }

  state = {
    loading: true,
    currentSelect: 'school',
    results: [],
    markers: [],
  }

  componentDidMount() {
    const { currentSelect } = this.state;
    this.fetchNearbyPlace(currentSelect);
  }

  handleMapLoad = this.handleMapLoad.bind(this);
  handleMapClick = this.handleMapClick.bind(this);
  handleMarkerClick = this.handleMarkerClick.bind(this);

  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log('handleMapLoad', map);
    }
  }

  handleMapClick(event) {
    console.log('handleMapClick', event);
  }

  handleMarkerClick(targetMarker) {
    console.log('targetMarker', targetMarker);
    console.log('markers', this.state.markers);
    
    const updatedMarkers = _.map(this.state.markers, marker => {
      if (marker.key === targetMarker.key) {
        return {
          ...marker,
          label: marker.label ? '' : marker.title,
        }
      }
      return marker;
    })
    
    this.setState({
      markers: updatedMarkers,
    });
  }

  handleType = (key) => {
    this.setState({
      currentSelect: key,
    });
    this.fetchNearbyPlace(key);
  }

  getDistance = async (desLat, desLng) => {
      const { lat, lng } = this.props;
      const url = 'http://maps.googleapis.com/maps/api/distancematrix/json?origins='+lat+','+lng+'&destinations='+desLat+','+desLng;

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
      markers: this.setMarker(newData),
    });
  }

  setMarker = (data) => {
    const markers = _.map(data, (result) => {
      return {
        position: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
        },
        title: result.name,
        label: '',
        // icon: '<div>a</div>',
        key: result.place_id,
        defaultAnimation: 2,
      }
    });
    return markers;
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

  render() {

    const { currentSelect, results, loading, markers } = this.state;

    console.log('results', results);

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
              <AsyncGettingStartedExampleGoogleMap
                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp"
                loadingElement={<Spin />}
                containerElement={
                  <div style={{ height: `100%` }} />
                }
                mapElement={
                  <div style={{ height: `100%` }} />
                }
                zoom={15}
                center={{ lat: this.props.lat, lng: this.props.lng }}
                onMapLoad={this.handleMapLoad}
                onMapClick={this.handleMapClick}
                markers={markers}
                onMarkerClick={this.handleMarkerClick}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NearbyPlace;
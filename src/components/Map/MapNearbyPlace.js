import React, { Component } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import _ from 'lodash';

const Container = styled.div`
  height: 400px;
`;

const mapContainerStyle = {
  float: 'left',
  height: '100%',
  width: '100%',
};

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
	  const { currentSelect } = this.state;
    this.fetchNearbyPlace(currentSelect);
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
    markers: [],
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
      console.log('distance', distance);
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

  	console.log('fetchNearbyPlace', type);
  	return;

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
	initializeMap = (lat, lng, radius) => {

		const map = new google.maps.Map(this.map, {
			center: { lat: lat, lng: lng },
			radius: radius,
		});

		var marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: map
    });
	}

	componentDidMount() {
		console.log('componentDidMount');
		this.initializeMap();
	}

	render() {

		const { currentSelect, results, loading, markers } = this.state;

		return (
			<Container>
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
              <div ref={c => this.map = c} style={mapContainerStyle} />
            </div>
          </div>
        </div>
			</Container>
		);
	}
}

export default MapNearbyPlace;
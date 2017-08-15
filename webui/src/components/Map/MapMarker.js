import React, { Component } from 'react';
import { Input } from 'antd';
import _ from 'lodash';

class MapMarker extends Component {

  static defaultProps = {
    center: {
      lat: 13.7248946,
      lng: 100.4930246,
    },
  }

  componentDidMount() {
    this.initializeMap();
  }

  getAddress = (place) => {
    const name = place.name;
    const address = place.formatted_address;
    // const street = _.get(_.find(addressComponents, com => _.get(com, 'types.0') === 'route'), 'short_name');
    // let distict = _.get(_.find(addressComponents, com => _.get(com, 'types.0') === 'sublocality_level_2'), 'short_name');
    // const locality = _.get(_.find(addressComponents, com => _.get(com, 'types.0') === 'locality'), 'short_name');
    // if (_.includes(locality, 'Tambon')) {
    //   distict = locality;
    // }
    // let amphur = _.get(_.find(addressComponents, com => _.get(com, 'types.0') === 'sublocality_level_1'), 'short_name');
    // amphur = _.get(_.find(addressComponents, com => _.get(com, 'types.0') === 'administrative_area_level_2'), 'short_name');
    // const province = _.get(_.find(addressComponents, com => _.get(com, 'types.0') === 'administrative_area_level_1'), 'short_name');
    // const zipcode = _.get(_.find(addressComponents, com => _.get(com, 'types.0') === 'postal_code'), 'short_name');

    const data = {
      name,
      address,
      // street,
      // amphur,
      // distict,
      // province,
      // zipcode,
    };

    this.props.onSearch(data);
  }

  /* global google */
  initializeMap = () => {
    const center = new google.maps.LatLng(this.props.center.lat, this.props.center.lng);

    const map = new google.maps.Map(this.map, {
      center,
      zoom: 15,
    });

    const input = document.getElementById('pac-input');
    const searchBox = new google.maps.places.SearchBox(input, {
      language: 'th',
    });
    // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    let markers = new google.maps.Marker({
      position: center,
      map,
    });

    map.addListener('bounds_changed', () => {
      markers.setPosition(map.getCenter());
      searchBox.setBounds(map.getBounds());
    });

    map.addListener('idle', () => {
      this.props.onChange(map.getCenter().lat(), map.getCenter().lng());
    });

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      const place = places[0];

      console.log('place', place);

      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();

      if (!place.geometry) {
        return;
      }

      markers.setMap(null);

      this.getAddress(place);

      // const icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25),
      // };

      // Create a marker for each place.
      markers = new google.maps.Marker({
        map,
        // icon,
        title: place.name,
        position: place.geometry.location,
      });

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      map.fitBounds(bounds);
    });
  }

  handleSearchBox = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <div className="MapMarker" style={{ width: '100%', height: '100%' }} >
        <Input id="pac-input" type="text" placeholder="ค้นหาสถานที่ตั้ง (ชื่อคอนโด, ถนน, หมู่บ้าน)" onPressEnter={this.handleSearchBox} />
        <div ref={c => this.map = c} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
}

export default MapMarker;

import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';

/* global google */

let map;
let marker;
let markers = [];
const MarkerWithLabel = require('markerwithlabel')(google.maps);

const convertLocationToLatLngZoom = (location) => {
  const [lat, lng, zoomStr] = _.split(location, ',');
  const zoom = _.toNumber(_.replace(zoomStr, 'z', ''));
  return {
    lat,
    lng,
    zoom,
  }
}
class MapLocation extends Component {

  static propTypes = {
    area: T.shape({
      name: T.string,
      bound: T.shape({
        ne: T.shape({ lat: T.number, lng: T.number }),
        sw: T.shape({ lat: T.number, lng: T.number }),
      }),
    }),
    onBoundChanged: T.func,
  }

  static defaultProps = {
    location: '13.7245599,100.492681,13z',
    area: {
      name: '',
      bound: {
        ne: { lat: undefined, lng: undefined },
        sw: { lat: undefined, lng: undefined },
      },
    },
    onBoundChanged: theMap => console.log('map zoom_changed', theMap.getBounds().toJSON()),
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillReceiveProps(nextProps) {
    // console.log('MapLocation::componentWillReceiveProps', nextProps);
    if (!_.isEqual(nextProps.area, this.props.area)) {
      const area = nextProps.area;

      // Use center + zoom, v1, moving on
      // const { lat, lng, zoom } = convertLocationToLatLngZoom(location);
      // map.panTo(new google.maps.LatLng(lat, lng));
      // map.setZoom(zoom);
      if (area.bound) {
        const { ne, sw } = area.bound;
        const mapBound = new google.maps.LatLngBounds(sw, ne);
        map.fitBounds(mapBound);
      }
    }

    if (!_.isEqual(nextProps.nearby, this.props.nearby)) {
      this.setMarker(nextProps.nearby);
    }
  }

  // setCenter = (lat, lng) => {
  //   this.props.onChange({
  //     lat,
  //     lng,
  //   });
  // }

  setMarker = (data) => {
    if (marker) {
      this.deleteMarkers();
    }
    if (_.size(data) > 0) {
      _.forEach(data, (value) => {
        if (value.location) {
          marker = new MarkerWithLabel({
            position: new google.maps.LatLng(value.location.lat, value.location.lon),
            map,
            labelContent: `<div class="price">${value.price}</div>`,
            labelAnchor: new google.maps.Point(0, 25),
            labelClass: 'custom-marker',
            icon: 'no',
          });
          markers.push(marker);

          const contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the ' +
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
            'south west of the nearest large town, Alice Springs; 450&#160;km ' +
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
            'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
            'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
            'Aboriginal people of the area. It has many springs, waterholes, ' +
            'rock caves and ancient paintings. Uluru is listed as a World ' +
            'Heritage Site.</p>' +
            '</div>' +
            '</div>';

          const infowindow = new google.maps.InfoWindow({
            content: contentString,
          });

          google.maps.event.addListener(marker, 'click', () => {
            infowindow.open(map, this);
          });

          // marker.addListener('click', () => {
          //   infowindow.open(map, marker);
          // });
        }
      });
    }
  }

  deleteMarkers = () => {
    this.clearMarkers();
    markers = [];
  }

  clearMarkers = () => {
    for (let i = 0; i < markers.length; i += 1) {
      markers[i].setMap(null);
    }
  }

  initializeMap = () => {
    console.log('initializeMap', this.props);
    // const { location } = this.props;
    // const { lat, lng, zoom } = convertLocationToLatLngZoom(location);
    const { ne, sw } = this.props.area.bound;
    const mapBound = new google.maps.LatLngBounds(sw, ne);
    console.log('mapBound', mapBound.getCenter().toJSON());
    map = new google.maps.Map(this.map, {
      center: mapBound.getCenter(),
      zoomControl: true,
      zoomControlOptions: { position: 'LEFT_CENTER' },
    });
    map.fitBounds(mapBound);


    map.addListener('idle', () => {
      this.props.onBoundChanged(map);
    });
  }

  render() {
    return (
      <div className="MapLocation">
        <div ref={c => this.map = c} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
}

export default MapLocation;

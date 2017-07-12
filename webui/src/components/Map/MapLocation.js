import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';

/* global google */

let map;
let marker;
let markers = [];
const MarkerWithLabel = require('markerwithlabel')(google.maps);

class MapLocation extends Component {

  static propTypes = {
    onDragEnd: T.func
  }

  static defaultProps = {
    center: { lat: 13.7245599, lng: 100.492681 },
    zoom: 13,
    onDragEnd: theMap => console.log('map dragEnd', theMap.getBounds.toJSON()),
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillReceiveProps(nextProps) {
    this.setMarker(nextProps.nearby);
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

          const contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the '+
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
            'south west of the nearest large town, Alice Springs; 450&#160;km '+
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
            'Aboriginal people of the area. It has many springs, waterholes, '+
            'rock caves and ancient paintings. Uluru is listed as a World '+
            'Heritage Site.</p>'+
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
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
    const { center, zoom } = this.props;

    map = new google.maps.Map(this.map, {
      zoom,
      center,
    });

    map.addListener('dragend', () => {
      this.props.onDragEnd(map);
      // console.log('toJSON', map.getBounds().toJSON());
      // const ne = map.getBounds().getNorthEast();
      // console.log('dqwhhduqh 1', ne.lat(), ne.lng());
      // console.log('dqwhhduqh 2', map.getBounds().getSouthWest());
      // this.setCenter(map.getCenter().lat(), map.getCenter().lng());
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

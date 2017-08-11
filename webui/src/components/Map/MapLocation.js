import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';

import numeral from 'numeral';

/* global google */

const MarkerWithLabel = require('markerwithlabel')(google.maps);

class MapLocation extends Component {

  map;

  static propTypes = {
    area: T.shape({
      name: T.string,
      bound: T.shape({
        ne: T.shape({ lat: T.number, lng: T.number }),
        sw: T.shape({ lat: T.number, lng: T.number }),
      }),
    }),
    startWithHilightMarkersWithId: T.arrayOf(T.string),
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
    startWithHilightMarkersWithId: [],
    onBoundChanged: theMap => console.log('map zoom_changed', theMap.getBounds().toJSON()),
  }

  constructor(props) {
    super(props);
    this.markers = {};
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.area, this.props.area)) {
      const area = nextProps.area;

      if (area.bound) {
        const { ne, sw } = area.bound;
        const mapBound = new google.maps.LatLngBounds(sw, ne);
        this.map.fitBounds(mapBound);
      }
    }

    // Check if marker need to be rerendered?

    const allIds = _.uniq([
      ..._.map(nextProps.nearby, item => item.id),
      ..._.map(this.props.nearby, item => item.id)
    ]);
    _.forEach(allIds, (markerId) => {
      const existingMarker = this.markers[markerId] !== undefined;
      const nextPropsMarkerData = _.find(nextProps.nearby, item => item.id === markerId);
      const inNextProps = nextPropsMarkerData !== undefined;

      if (existingMarker) {
        if (!inNextProps) {
          // Not found in nextProps
          this.clearMarkerWithId(markerId);
        } else if (existingMarker && inNextProps) {
          const thisPropsMarkerData = _.find(this.props.nearby, item => item.id === markerId);
          if (!_.isEqual(thisPropsMarkerData, nextPropsMarkerData)) {
            this.updateMarker(nextPropsMarkerData);
          }
          // Do nothing
        }
      } else {
        // New
        this.createMarker(nextPropsMarkerData);
      }
    })

  }

  createContentOnMarker = (marker, markerData) => {
    let option = null;
    if (markerData.bedroom > 0 || markerData.bathroom > 0) {
      option = `<div class="option">
        <ul>
          ${markerData.bedroom > 0 ? `<li><span aria-hidden="true" class="fa fa-bed"></span><span>${markerData.bedroom}</span></li>` : ''}
          ${markerData.bathroom > 0 ? `<li><span aria-hidden="true" class="fa fa-bath"></span><span>${markerData.bathroom}</span></li>` : ''}
        </ul>
      </div>`;
    }

    const infowindow = new google.maps.InfoWindow({
      content: `<div class="PropertyItem">
        <div class="Thumbnail">
          <div class="image" style="background: url(${markerData.mainImage.file.url}) center center / cover;"></div>
          <div class="content">
            <div class="name">${markerData.project}</div>
            <div class="price">${numeral(markerData.price).format('0,0')} บาท</div>
            <div class="place">${markerData.street} - ${markerData.province}</div>
            ${option}
          </div>
        </div>
      </div>`,
    });

    const _map = this.map;

    marker.addListener('click', () => {
      window.location = `#/property/${markerData.id}?preview=true`;
      // window.open(`#/property/${markerData.id}?preview=true`, '_blank', 'toolbar=0,location=0,menubar=0');
    });

    marker.addListener('mouseover', () => {
      infowindow.open(_map, marker);
      const iwOuter = document.getElementsByClassName('gm-style-iw');
      const iwBackground = iwOuter[0].parentElement;
      if (iwBackground.children[0]) iwBackground.children[0].remove();
      if (iwBackground.children[1]) iwBackground.children[1].remove();
    });

    marker.addListener('mouseout', () => {
      infowindow.close(_map, marker);
    });
  }

  createMarker = (markerData) => {
    // console.log('createMarker', markerData);
    const marker = new MarkerWithLabel({
      position: new google.maps.LatLng(markerData.location.lat, markerData.location.lon),
      map: this.map,
      labelContent: `<a href="#/property/${markerData.id}"><div class="price">${numeral(markerData.price).format('฿0.0a')}</div></a>`,
      labelAnchor: new google.maps.Point(22, 25),
      labelClass: `custom-marker ${markerData.hilight ? 'hilight' : ''}`,
      icon: 'no',
    });

    this.createContentOnMarker(marker, markerData);

    _.set(this.markers, markerData.id, marker);
  }

  updateMarker = (markerData) => {
    // console.log('updateMarker', markerData);
    this.clearMarkerWithId(markerData.id);
    this.createMarker(markerData);
  }

  clearMarkerWithId = (id) => {
    // console.log('clearMarkerWithId', id);
    const markerRef = _.get(this.markers, id);
    markerRef.setMap(null);
    delete this.markers[id];
  }

  clearMarkers = () => {
    _.forEach(this.markers, (markerRef) => {
      markerRef.setMap(null);
    });
    this.markers = {};
  }

  initializeMap = () => {
    this.map = new google.maps.Map(this.mapRef, {
      zoomControl: true,
      zoomControlOptions: { position: 'LEFT_CENTER' },
    });

    const area = this.props.area;
    if (area && area.bound) {
      const { ne, sw } = this.props.area.bound;
      const mapBound = new google.maps.LatLngBounds(sw, ne);
      this.map.fitBounds(mapBound);
    }

    this.map.addListener('idle', () => {
      this.props.onBoundChanged(this.map);
    });
  }

  render() {
    return (
      <div className="MapLocation">
        <div ref={c => this.mapRef = c} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
}

export default MapLocation;

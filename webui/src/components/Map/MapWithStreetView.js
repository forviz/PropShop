import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const mapContainerStyle = {
  float: 'left',
  height: '100%',
  width: '50%',
};

class MapComponent extends Component {

  static defaultProps = {
    center: { lat: 42.345573, lng: -71.098326 },
    zoom: 14,
  }

  componentDidMount() {
    this.initializeMap();
  }

  /* global google */
  initializeMap = () => {
    const { center, zoom } = this.props;
    const map = new google.maps.Map(this.map, {
      center,
      zoom,
      fullscreenControl: true,
    });

    const panorama = new google.maps.StreetViewPanorama(this.pano, {
      position: this.props.center,
      pov: {
        heading: 34,
        pitch: 10,
      },
      visible: true,
    });
    map.setStreetView(panorama);
  }

  render() {
    return (
      <Container>
        <div ref={c => this.map = c} style={mapContainerStyle} />
        <div ref={c => this.pano = c} style={mapContainerStyle} />
      </Container>
    );
  }
}

export default MapComponent;

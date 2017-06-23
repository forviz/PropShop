import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 400px;
`;

const mapContainerStyle = {
  float: 'left',
  height: '100%',
  width: '100%',
};

class MapComponent extends Component {

	static defaultProps = {
		center: { lat: 42.345573, lng: -71.098326 },
		zoom: 14,
	}

	/*global google */
	initializeMap = () => {

		const { center, zoom } = this.props;
		const map = new google.maps.Map(this.map, {
			center,
			zoom,
		});

		var marker = new google.maps.Marker({
      position: this.props.center,
      map: map
    });
	}

	componentDidMount() {
		console.log('componentDidMount');
		this.initializeMap();
	}

	render() {
		return (
			<Container>
				<div ref={c => this.map = c} style={mapContainerStyle} />
			</Container>
		);
	}
}

export default MapComponent;
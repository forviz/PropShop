import React, { Component } from 'react';
import _ from 'lodash';

const typeList = [
  { key: 'school', name: 'School' },
  { key: 'bank', name: 'Bank' },
  { key: 'hospital', name: 'Hospital' },
  { key: 'shopping_mall', name: 'Shopping' },
  { key: 'train_station', name: 'Transport' },
]

class NearbyPlace extends Component {

  static defaultProps = {
    lat: 13.7248946,
    lng: 100.4930246,
    radius: 1000,
  }

  state = {
    currentSelect: 'school',
  }

  componentDidMount() {
    const { currentSelect } = this.state;
    this.fetchNearbyPlace(currentSelect);
  }

  handleType = (key) => {
    this.setState({
      currentSelect: key,
    });
  }

  fetchNearbyPlace = (type) => {
    const { lat, lng, radius } = this.props;
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lng+'&radius='+radius+'&type='+type+'&key='+process.env.REACT_APP_APIKEY;
    
    const header = new Headers({
      'Access-Control-Allow-Origin':'*',
    });

    fetch(url, {
      headers: header,
    })  
    .then((response) => {  
        if (response.status !== 200) {  
          console.log('Looks like there was a problem. Status Code: ' +  
            response.status);  
          return;  
        }
        response.json().then((data) => {  
          console.log(data);  
        });  
      }  
    )  
    .catch(function(err) {  
      console.log('Fetch Error :-S', err);  
    });
  }

  render() {

    const { currentSelect } = this.state;
    
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
                <div className="clearfix">
                  <div className="pull-left">asdsadsad</div>
                  <div className="pull-right">1.3 km</div>
                </div>
                <div className="clearfix">
                  <div className="pull-left">asdsadsad</div>
                  <div className="pull-right">1.3 km</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="place-map">

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NearbyPlace;
import React, { Component } from 'react';

import SpecialFeature from '../../containers/SpecialFeature';

class Step1 extends Component {

	state = {

	}

	handleFilterSpecialFeature = (data) => {
		this.props.onSelect(data);
	}

  render() {

  	const { specialFeatureData } = this.props;

    return (
      <div id="Step1">
        <div className="container">
      		<div className="row">
	        	<div className="col-md-8 col-md-offset-2">
	        		<h1>คุณสมบัติพิเศษ</h1>
	        		<div className="form">
	        			<SpecialFeature items={specialFeatureData} onSelect={this.handleFilterSpecialFeature} />
	        		</div>
	        	</div>
	        </div>
	      </div>
      </div>
    );
  }
}

export default Step1;
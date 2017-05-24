import React, { Component } from 'react';
import { Steps } from 'antd';

import Step0 from './step0';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

import specialFeatureData from '../../../public/data/specialFeatureData.json';

const Step = Steps.Step;

const steps = [
 	{ title: 'รายละเอียดทรัพย์สิน' },
 	{ title: 'คุณสมบัติพิเศษ' },
 	{ title: 'อัพโหลดรูปภาพ' },
 	{ title: 'ข้อตกลงและเงื่อนไข' },
];

class Sell extends Component {

	state = {
		step: 0,
		step0: {},
		step1: {
			specialFeature: specialFeatureData
		},
	}

	prevStep = () => {
		const { step } = this.state;
		if ( step <= 0 ) {
			return;
		}
		this.setState(prevState => ({
      step: prevState.step - 1
    }));
	}

	nextStep = () => {
		const { step } = this.state;
		if ( step >= steps.length - 1 ) {
			return;
		}
		this.setState(prevState => ({
      step: prevState.step + 1
    }));
	}

	handleSpecialFeatureData = (data) => {
		this.setState(prevState => ({
      step1: { ...prevState.step1, specialFeature: data },
    }));
	}

  render() {

  	const { step } = this.state;

  	let renderStep = null;
  	switch(step) {
		  case 0:
	      renderStep = <Step0 />;
	      break;
		  case 1:
	      renderStep = <Step1 specialFeatureData={this.state.step1.specialFeature} onSelect={this.handleSpecialFeatureData} />;
	      break;
	    case 2:
	      renderStep = <Step2 />;
	      break;
	    case 3:
	      renderStep = <Step3 />;
	      break;
		  default:
		    
		}

    return (
      <div id="Sell">
      	<div className="container">
      		<div className="row">
	        	<div className="col-md-10 col-md-offset-1">
	        		<div className="steps">
	        			<Steps current={step}>
	        				{ steps.map(item => <Step key={item.title} title={item.title} />) }
							  </Steps>
	        		</div>
	        	</div>
	        </div>
      	</div>
        <hr/>
        {renderStep}
        <div className="container">
      		<div className="row">
	        	<div className="col-md-6 col-md-offset-3">
	        		<div className="action">
	        			<div className="row">
	        				<div className="col-md-6 text-right">
	        					<button type="button" className="btn btn-default" onClick={this.prevStep}>ยกเลิก</button>
	        				</div>
	        				<div className="col-md-6">
	        					<button type="button" className="btn btn-primary" onClick={this.nextStep}>ต่อไป</button>
	        				</div>
	        			</div>
	        		</div>
	        	</div>
	        </div>
      	</div>
      </div>
    );
  }
}

export default Sell;
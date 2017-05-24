import React, { Component } from 'react';
import { Rate, Tabs } from 'antd';
import numeral from 'numeral';

import FontAwesome from 'react-fontawesome';

const TabPane = Tabs.TabPane;

import _ from 'lodash';

import ContactAgent from '../../components/ContactAgent';
import RealEstateItem from '../../components/RealEstateItem';

import realEstateData from '../../../public/data/realEstateData.json';
import agentData from '../../../public/data/agentData.json';

class AgentDetail extends Component {

	state = {

	}

  render() {

  	const { match } = this.props;

    const id = parseInt(match.params.id, 10);
    const item = _.find(agentData, ['id', id]);
    const realEstate = _.filter(realEstateData, ['agentId', parseInt(item.id, 10)]);

    return (
      <div id="AgentDetail">
        <div className="container">
      		<div className="row">
	        	<div className="col-md-8 col-md-offset-2">
	        		<div className="search" style={{ margin: '25px 0' }}>
	        			<form className="form-inline">
								  <div className="form-group" style={{ width: '70%' }}>
								    <input type="text" className="form-control" placeholder="ค้นหาจากชื่อนายหน้า, ชื่อโครงการ, ชื่อบริษัท" style={{ width: '100%' }} />
								  </div>
								  <button type="button" className="btn btn-primary">ค้นหา</button>
								</form>
	        		</div>
	        	</div>
	        </div>
      	</div>
        <hr/>
        <div className="container">
      		<div className="row">
	        	<div className="col-md-9">
	        		<div className="row">
	        			<div className="info">
	        				<div className="col-md-3 vcenter">
		        				<div className="image"><img src={item.image} alt={item.name} /></div>
		        			</div>
		        			<div className="col-md-9 vcenter">
		        				<div className="detail">
		        					<div className="name">{item.name}</div>
		        					<div className="rating">
		        						<Rate disabled defaultValue={item.rate.rating} />
		        						<span>({item.rate.count})</span>
		        					</div>
		        					<div><span className="phone">{item.phone}</span> <span className="company">จาก{item.company}</span></div>
		        					<div className="specialization">
		        						<span><b>ความชำนาญพิเศษ: </b></span> <span>{item.specialization}</span>
		        					</div>
		        					<div className="license-number">
		        						<span><b>หมายเลขใบอนุญาต: </b></span> <span># {item.licenseNumber}</span>
		        					</div>
		        				</div>
		        			</div>
	        			</div>
	        			<Tabs defaultActiveKey="1" style={{margin: '30px 0'}}>
							    <TabPane tab="ภาพรวม" key="1">
							    	<section className="dashboard">
							    		<h3>เกี่ยวกับ{item.name}</h3>
								    	<div>{item.about}</div>
							    	</section>
							    	<section className="property">
							    		<h3>คุณสมบัติของมาดามแป้ง({realEstate.length})</h3>
							    		{
	                      _.map(realEstate, (item, key) => {
	                        return (
	                          <RealEstateItem item={item} type="detail" />
	                        );
	                      })
	                    }
							    	</section>
							    </TabPane>
							    <TabPane tab="ความคิดเห็น(9)" key="2">Content of Tab Pane 2</TabPane>
							    <TabPane tab="คุณสมบัติ(80)" key="3">Content of Tab Pane 3</TabPane>
							    <TabPane tab="ความเคลื่อนไหว(2)" key="4">Content of Tab Pane 4</TabPane>
							  </Tabs>
	        		</div>
	        	</div>
	        	<div className="col-md-3">
	        		<div style={{margin: '40px 0 5px 0',fontSize: '16px'}}>ติดต่อกับ{item.name}</div>
	        		<ContactAgent />
	        	</div>
	        </div>
	      </div>
      </div>
    );
  }
}

export default AgentDetail;
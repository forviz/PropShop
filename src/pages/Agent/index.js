import React, { Component } from 'react';
import { Icon } from 'antd';

import AgentItem from '../../components/AgentItem';

import agentData from '../../../public/data/agentData.json';

import imgExpert from '../../images/pages/agent/expert.png';
import imgReview from '../../images/pages/agent/review.png';
import imgWebboard from '../../images/pages/agent/webboard.png';

class Agent extends Component {

	state = {

	}

  render() {
    return (
      <div id="Agent">
      	<div className="container">
      		<div className="row">
	        	<div className="col-md-8 col-md-offset-2">
	        		<div className="search">
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
	        	<div className="col-md-10 col-md-offset-1">
	        		<div className="persons">
	        			<div className="row">
	        				<div className="col-md-4">
	        					<div className="title clearfix">
	        						<div className="text pull-left">ผู้เชี่ยวชาญอสังหาริมทรัพย์ในท้องถิ่น</div>
		        					<div className="icon pull-right"><Icon type="right-circle" /></div>
	        					</div>
	        					<hr/>
	        					<div className="detail">
	        						<AgentItem item={agentData[0]} />
	        						<AgentItem item={agentData[1]} />
	        					</div>
	        					<div className="view_more">
	        						<a>ค้นหาเพิ่มเติม</a>
	        					</div>
	        				</div>
	        				<div className="col-md-4">
	        					<div className="title clearfix">
	        						<div className="text pull-left">ผู้ขายที่มียอดขายสูงสุดในปีนี้</div>
		        					<div className="icon pull-right"><Icon type="right-circle" /></div>
	        					</div>
	        					<hr/>
	        					<div className="detail">
	        						<AgentItem item={agentData[2]} />
	        						<AgentItem item={agentData[3]} />
	        					</div>
	        					<div className="view_more">
	        						<a>ค้นหาเพิ่มเติม</a>
	        					</div>
	        				</div>
	        				<div className="col-md-4">
	        					<div className="title clearfix">
	        						<div className="text pull-left">ผู้เชี่ยวชาญการโยกย้ายถิ่นฐาน</div>
		        					<div className="icon pull-right"><Icon type="right-circle" /></div>
	        					</div>
	        					<hr/>
	        					<div className="detail">
	        						<AgentItem item={agentData[4]} />
	        						<AgentItem item={agentData[5]} />
	        					</div>
	        					<div className="view_more">
	        						<a>ค้นหาเพิ่มเติม</a>
	        					</div>
	        				</div>
	        			</div>
	        		</div>
	        	</div>
	        </div>
      	</div>
      	<div className="about">
      		<div className="container">
	      		<div className="row">
		        	<div className="col-md-8 col-md-offset-2">
		        		<h3 className="topic">ดูข้อมูลที่จำเป็นที่คุณต้องการในศูนย์ตัวแทน</h3>
		        		<div className="items">
		        			<div className="row">
			        			<div className="col-md-4 vbottom">
			        				<div className="image"><img src={imgReview} alt="รีวิว" /></div>
			        				<div className="title">รีวิว</div>
			        				<div className="detail">ดูบทวิจารณ์ที่เป็นกลางจากก่อนหน้านี้ลูกค้าและคนที่คุณไว้วางใจ</div>
			        			</div>
			        			<div className="col-md-4 vbottom">
			        				<div className="image"><img src={imgExpert} alt="ประสบการณ์ที่เกี่ยวข้อง" /></div>
			        				<div className="title">ประสบการณ์ที่เกี่ยวข้อง</div>
			        				<div className="detail">ดูความชำนาญและทักษะของเอเจนซีและบ้านที่พวกเขาขายใกล้บ้านคุณ</div>
			        			</div>
			        			<div className="col-md-4 vbottom">
			        				<div className="image"><img src={imgWebboard} alt="ความเชี่ยวชาญในตลาดท้องถิ่น" /></div>
			        				<div className="title">ความเชี่ยวชาญในตลาดท้องถิ่น</div>
			        				<div className="detail">ดูคำถามคำตอบและบล็อกของตัวแทนในพื้นที่ชุมชน <span className="text-green">เว็บบอร์ด</span> ของเรา</div>
			        			</div>
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

export default Agent;
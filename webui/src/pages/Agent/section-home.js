import React from 'react';
import { Icon } from 'antd';
import AgentItem from '../../components/AgentItem';
import agentData from './agentData.json';

export default () => {
  return (
    <div className="persons">
      <div className="row">
        <div className="col-md-4">
          <div className="title clearfix">
            <div className="text pull-left">ผู้เชี่ยวชาญอสังหาริมทรัพย์ในท้องถิ่น</div>
            <div className="icon pull-right"><Icon type="right-circle" /></div>
          </div>
          <hr />
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
          <hr />
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
          <hr />
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
  );
}

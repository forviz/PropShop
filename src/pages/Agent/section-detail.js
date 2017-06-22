import React, { Component } from 'react';
import T from 'prop-types';
import { Rate, Tabs } from 'antd';
import numeral from 'numeral';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import { mapEntryToAgent } from './agent-helper';

import { getAgentEntry } from '../../api/agent';
import { receiveAgentEntity } from '../../actions/agent-actions';

import ContactAgent from '../../components/ContactAgent';
import RealEstateItem from '../../components/RealEstateItem';

import realEstateData from '../../../public/data/realEstateData.json';
import agentData from '../../../public/data/agentData.json';

const TabPane = Tabs.TabPane;

const mapStateToProps = (state, ownProps) => {
  const agentId = ownProps.match.params.id;
  const entity = _.get(state, `entities.agents.entities.${agentId}`);
  return {
    agentId,
    fetchStatus: _.get(state, `entities.agents.fetchStatus.${agentId}`),
    agent: mapEntryToAgent(entity),
  };
};

const actions = {
  getAgentInfo: (agentId) => {
    return (dispatch) => {
      getAgentEntry(agentId)
      .then((agent) => {
        dispatch(receiveAgentEntity(agent.sys.id, agent));
      })
    }
  }
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(
class AgentDetail extends Component {

  static propTypes = {
    agentId: T.string.isRequired,
    fetchStatus: T.string.isRequired,
    agent: T.shape({
      id: T.string,
      name: T.string,
      lastname: T.string,
      image: T.string,
      rate: T.shape({
        rating: T.number,
        count: T.number,
      }),
      phone: T.string,
      company: T.string,
      specialization: T.string,
      licenseNumber: T.string,
      about: T.string,
      UID: T.string,
      area: T.string,
    }),
    actions: T.shape({
      getAgentInfo: T.func,
    }).isRequired,
  }

  static defaultProps = {
    agent: {
      id: '',
      name: '',
      lastname: '',
      image: '',
      rate: {
        rating: 0,
        count: 0,
      },
      phone: '',
      company: '',
      specialization: '',
      licenseNumber: '',
      about: '',
      UID: '',
      area: '',
    },
    fetchStatus: false,
    agentId: '',
  }

  componentDidMount() {
    const { fetchStatus, agentId } = this.props;
    const { getAgentInfo } = this.props.actions;
    if (fetchStatus !== 'loaded') {
      getAgentInfo(agentId);
    }
  }

  render() {
    const { agent, agentId } = this.props;
    const {
      name,
      lastname,
      image,
      rate,
      specialization,
      phone,
      company,
      licenseNumber,
      about,
    } = agent;

    const realEstate = _.filter(realEstateData, ['agentId', agentId]);

    return (
      <div id="AgentDetail">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="row">
                <div className="info">
                  <div className="col-md-3 vcenter">
                    <div className="image"><img src={image} alt={name} /></div>
                  </div>
                  <div className="col-md-9 vcenter">
                    <div className="detail">
                      <div className="name">{name}</div>
                      <div className="rating">
                        <Rate disabled defaultValue={rate.rating} />
                        <span>({rate.count})</span>
                      </div>
                      <div><span className="phone">{phone}</span> <span className="company">จาก{company}</span></div>
                      <div className="specialization">
                        <span><b>ความชำนาญพิเศษ: </b></span> <span>{specialization}</span>
                      </div>
                      <div className="license-number">
                        <span><b>หมายเลขใบอนุญาต: </b></span> <span># {licenseNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Tabs defaultActiveKey="1" style={{ margin: '30px 0' }}>
                  <TabPane tab="ภาพรวม" key="1">
                    <section className="dashboard">
                      <h3>เกี่ยวกับ{agent.name}</h3>
                      <div>{agent.about}</div>
                    </section>
                    <section className="property">
                      <h3>คุณสมบัติของ {}({realEstate.length})</h3>
                      {
                        _.map(realEstate, (agent, key) => {
                          return (
                            <RealEstateItem item={agent} type="detail" />
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
              <div style={{ margin: '40px 0 5px 0', fontSize: '16px' }}>ติดต่อกับ{agent.name}</div>
              <ContactAgent />
            </div>
          </div>
        </div>
      </div>
    );
  }
});

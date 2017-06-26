import React, { Component } from 'react';
import T from 'prop-types';
import { Rate, Tabs } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { getAgentEntry, getAgentProperties, getAgentReferences, getAgentActivities } from '../../api/agent';
import { receiveAgentEntity, receiveReferenceEntity } from '../../actions/agent-actions';
import { receivePropertyEntity } from '../../actions/property-actions';
import { receiveActivityEntity } from '../../actions/activity-actions';

import ContactAgent from '../../components/ContactAgent';
import RealEstateItem from '../../components/RealEstateItem';
import AgentReferenceItem from '../../components/AgentReferenceItem';
import ActivityItem from '../../components/ActivityItem';


import realEstateData from '../../../public/data/realEstateData.json';

const TabPane = Tabs.TabPane;

// Selector
const getAgentEntitySelector = (state, agentId) => {
  return _.get(state, `entities.agents.entities.${agentId}`);
};

const getReferenceEntitySelector = (state, referenceId) => {
  return _.get(state, `entities.references.entities.${referenceId}`);
};

const getPropertyEntitySelector = (state, propertyId) => {
  return _.get(state, `entities.properties.entities.${propertyId}`);
};

const getActivityEntitySelector = (state, acivityId) => {
  return _.get(state, `entities.activities.entities.${acivityId}`);
};

const getAgentReferencesSelector = (state, agentId) => {
  const agent = getAgentEntitySelector(state, agentId);
  const referenceIds = _.get(agent, 'references', []);
  return _.compact(_.map(referenceIds, id => getReferenceEntitySelector(state, id)));
};

const getAgentPropertiesSelector = (state, agentId) => {
  const agent = getAgentEntitySelector(state, agentId);
  const propertyIds = _.get(agent, 'properties', []);
  return _.compact(_.map(propertyIds, id => getPropertyEntitySelector(state, id)));
};

const getAgentActivitiesSelector = (state, agentId) => {
  const agent = getAgentEntitySelector(state, agentId);
  const activityIds = _.get(agent, 'activities', []);
  return _.compact(_.map(activityIds, id => getActivityEntitySelector(state, id)));
};

const mapStateToProps = (state, ownProps) => {
  const agentId = ownProps.match.params.id;
  return {
    agentId,
    fetchStatus: _.get(state, `entities.agents.fetchStatus.${agentId}`),
    agent: getAgentEntitySelector(state, agentId),
    references: getAgentReferencesSelector(state, agentId),
    properties: getAgentPropertiesSelector(state, agentId),
    activities: getAgentActivitiesSelector(state, agentId),
  };
};

const actions = {
  getAgentInfo: (agentId) => {
    return (dispatch) => {
      getAgentEntry(agentId)
      .then((agent) => {
        // #1: Update Agent Entity
        dispatch(receiveAgentEntity(agent.id, agent));

        // #2: get Agent Properties
        getAgentProperties(agentId)
        .then((response) => {
          // Save Agent References to entity
          dispatch({
            type: 'ENTITY/AGENT/PROPERTIES/RECEIVED',
            ids: _.map(response.items, item => item.id),
            agentId,
          });

          const properties = response.items;
          _.forEach(properties, (propoerty) => {
            dispatch(receivePropertyEntity(propoerty.id, propoerty));
          });
        });

        // #3: get Agent Reference
        getAgentReferences(agentId)
        .then((response) => {
          // Save Agent References to entity
          dispatch({
            type: 'ENTITY/AGENT/REFERENCES/RECEIVED',
            ids: _.map(response.items, item => item.id),
            agentId,
          });

          const reviews = response.items;
          _.forEach(reviews, (review) => {
            dispatch(receiveReferenceEntity(review.id, review));
          });
        });

        // #4: get Agent Activity
        getAgentActivities(agentId)
        .then((response) => {
          // Save Agent References to entity
          dispatch({
            type: 'ENTITY/AGENT/ACTIVITIES/RECEIVED',
            ids: _.map(response.items, item => item.id),
            agentId,
          });

          const activities = response.items;
          _.forEach(activities, (activity) => {
            dispatch(receiveActivityEntity(activity.id, activity));
          });
        });
      });
    };
  },
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
    properties: T.arrayOf(T.shape({
      id: T.string,
    })),
    references: T.arrayOf(T.shape({
      id: T.string,
    })),
    activities: T.arrayOf(T.shape({
      id: T.string,
    })),
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
    properties: [],
    references: [],
    activities: [],
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
    const { agent, agentId, properties, references, activities } = this.props;
    console.log('AgentDetail, render', this.props);
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
                    <div className="image">
                      <img src={image} alt={name} className="img-responsive" />
                    </div>
                  </div>
                  <div className="col-md-9 vcenter">
                    <div className="detail">
                      <div className="name">{name} {lastname}</div>
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
                      <h3>เกี่ยวกับ {name}</h3>
                      <div>{about}</div>
                    </section>
                    <section className="property">
                      <h3>คุณสมบัติของ ({_.size(properties)})</h3>
                      {
                        _.map(realEstate, (item, key) => {
                          return (
                            <RealEstateItem key={key} item={item} type="detail" />
                          );
                        })
                      }
                    </section>
                  </TabPane>
                  <TabPane tab={`ความคิดเห็น(${_.size(references)})`} key="2">
                    {
                      _.map(references, reference =>
                        <AgentReferenceItem {...reference} />
                      )
                    }
                  </TabPane>
                  <TabPane tab={`อสังหาริมทรัพย์(${_.size(properties)})`} key="3">
                    {
                      _.map(properties, property =>
                        <RealEstateItem type="sell" item={property} />
                      )
                    }
                  </TabPane>
                  <TabPane tab={`ความเคลื่อนไหว(${_.size(activities)})`} key="4">
                    {
                      _.map(activities, activity =>
                        <ActivityItem {...activity} />
                      )
                    }
                  </TabPane>
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

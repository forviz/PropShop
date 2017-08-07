import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import queryString from 'query-string';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';

import AgentSearchResult from './search-result';
import AgentDetail from './section-detail';

import AgentSearch from './component-search';
import AgentSectionHome from './section-home';
import AgentFooter from './section-footer';

import * as firebase from '../../api/firebase';
import { getAgentEntries } from '../../api/agent';
import { receiveAgentEntity } from '../../actions/agent-actions';

const mapStateToProps = (state, ownProps) => {
  const urlParam = _.get(ownProps, 'location.search');
  const { search, area } = queryString.parse(urlParam);
  const domain = _.get(state, 'domain.agentSearch');

  // Get Search Result ID from domain agentSearch
  const searchResultIDs = domain.searchResult;

  // Convert ID to Entity
  const searchResultAgents = _.map(searchResultIDs, (id) => {
    const entity = _.get(state, `entities.agents.entities.${id}`);
    return entity;
  });

  return {
    showSearchResult: !_.isEmpty(urlParam),
    searchQuery: {
      search,
      area,
    },
    searchResult: searchResultAgents,
  };
};

const actions = {
  searchAgents: (text, area) => {
    return (dispatch) => {
      getAgentEntries({ text, area })
      .then((response) => {
        // Save/Update Agent Entities
        const agents = _.get(response, 'items', []);
        _.forEach(agents, (agent) => {
          dispatch(receiveAgentEntity(agent.id, agent));
        });

        // Save Agent Search Result
        dispatch({
          type: 'DOMAIN/AGENT_SEARCH/RESULT_RECEIVED',
          ids: _.map(response.items, item => item.id),
        });
      });
    };
  },
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(
class Agent extends Component {

  static propTypes = {
    history: T.shape({
      push: T.func,
    }).isRequired,
    showSearchResult: T.bool.isRequired,
    searchQuery: T.shape({
      search: T.string,
      area: T.string,
    }),
    searchResult: T.arrayOf(T.shape({
      id: T.string,
      name: T.string,
      image: T.string,
      rate: T.shape({
        rating: T.number,
        count: T.number,
      }),
    })),
    actions: T.shape({
      searchAgents: T.func.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    showSearchResult: false,
    searchQuery: {
      search: '',
      area: '',
    },
    searchResult: [],
  }

  constructor(props) {
    super(props);
    // this.getProfile(props);
  }

  // getProfile = (props) => {
  //   firebase.core().auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       const { fetchUserProfile } = props.actions;
  //       fetchUserProfile(user);
  //     }
  //   });
  // }

  handleSearchAgent = (search, area) => {
    const { history } = this.props;
    history.push({
      pathname: '/agent',
      search: `?search=${search}&area=${area}`,
    });
  }

  render() {
    const { showSearchResult, searchQuery, searchResult } = this.props;
    const { searchAgents } = this.props.actions;
    return (
      <div id="Agent">
        <AgentSearch onSearch={this.handleSearchAgent} />
        <div className="container">
          <div className="row">
            <div className="col-md-10 col-md-offset-1">
              <Route
                key="agent-home"
                path="/agent"
                exact
                render={(routerProp) => {
                  if (showSearchResult) {
                    return (
                      <AgentSearchResult
                        searchResult={searchResult}
                        searchQuery={searchQuery}
                        onSearch={searchAgents}
                      />
                    );
                  }
                  return (<AgentSectionHome {...routerProp} />);
                }}
              />
              <Route
                key="agent-detail"
                path="/agent/:id"
                exact
                component={AgentDetail}
              />
            </div>
          </div>
        </div>
        <AgentFooter />
      </div>
    );
  }
});

import React, { Component } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import queryString from 'query-string';

import { bindActionCreators } from 'redux';

import AgentItem from '../../components/AgentItem/full';

import AgentFooter from './section-footer';
import { getAgents } from '../../api/agent';

import { receiveAgentEntity } from '../../actions/agent-actions';

const SearchSummary = styled.div`
  font-size: 24px;
  margin: 15px 0 5px;
`;

class AgentSearchResult extends Component {

  static propTypes = {
    result: T.arrayOf({
      id: T.string,
      name: T.string,
      image: T.string,
      rate: {
        rating: T.number,
        count: T.number,
      },
    })
  }

  static defaultProps = {
    result: [],
  }

  render() {
    const { result } = this.props;

    const searchResult = _.map(result, agent => <AgentItem item={agent} />)
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <SearchSummary>แสดง {_.size(result)} ผลลัพธ์การค้นหา "{this.state.query.search}"</SearchSummary>
            {searchResult}
          </div>
        </div>
      </div>
    );
  }
}

export default AgentSearchResult;

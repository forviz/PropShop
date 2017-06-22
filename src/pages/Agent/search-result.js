import React, { Component } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import _ from 'lodash';

import AgentItem from '../../components/AgentItem/full';

const SearchSummary = styled.div`
  font-size: 24px;
  margin: 15px 0 5px;
`;

class AgentSearchResult extends Component {

  static propTypes = {
    searchQuery: T.shape({
      search: T.string,
      area: T.string,
    }),
    searchResult: T.arrayOf({
      id: T.string,
      name: T.string,
      image: T.string,
      rate: {
        rating: T.number,
        count: T.number,
      },
    }),
    onSearch: T.func.isRequired,
  }

  static defaultProps = {
    searchQuery: {
      search: '',
      area: '',
    },
    searchResult: [],
  }

  componentDidMount() {
    const { search, area } = this.props.searchQuery;
    const { onSearch } = this.props;
    onSearch(search, area);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.searchQuery, this.props.searchQuery)) {
      const { search, area } = this.props.searchQuery;
      const { onSearch } = this.props;
      onSearch(search, area);
    }
  }

  render() {
    const { searchResult } = this.props;

    const agentItems = _.map(searchResult, agent => <AgentItem item={agent} />);
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <SearchSummary>แสดง {_.size(searchResult)} ผลลัพธ์การค้นหา {this.props.searchQuery.search}</SearchSummary>
            {agentItems}
          </div>
        </div>
      </div>
    );
  }
}

export default AgentSearchResult;

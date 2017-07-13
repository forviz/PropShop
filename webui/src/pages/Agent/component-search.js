import React, { Component } from 'react';
import T from 'prop-types';

class SearchAgent extends Component {

  static propTypes = {
    onSearch: T.func,
  }

  state = {
    searchText: '',
    area: '',
  }

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.handleSearchAgent();
    }
  }

  handleSearchAgent = () => {
    const { searchText, area } = this.state;
    const { onSearch } = this.props;
    onSearch(searchText, area);
  }

  render() {
    const { search } = this.state;
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-md-offset-2">
              <div className="search">
                <form className="form-inline">
                  <div className="form-group" style={{ width: '70%' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={search}
                      onChange={e => this.setState({ searchText: e.target.value })}
                      placeholder="ค้นหาจากชื่อนายหน้า, ชื่อโครงการ, ชื่อบริษัท"
                      style={{ width: '100%' }}
                      onKeyDown={this.handleKeyDown}
                    />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={this.handleSearchAgent}>ค้นหา</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}

export default SearchAgent;

import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Alert, Pagination } from 'antd';
import _ from 'lodash';

import * as PropertyActions from '../../../actions/property-actions';
import PropertyItem from '../../../modules/property/components/PropertyItem';

class Property extends Component {

  static propTypes = {
    actions: T.shape({
      fetchPropertiesByAgent: T.func,
    }).isRequired,
    user: T.shape().isRequired,
    fetching: T.bool.isRequired,
    fetch: T.bool.isRequired,
    page: T.number.isRequired,
    limit: T.number.isRequired,
    total: T.number.isRequired,
    data: T.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.getPropertiesByAgent();
  }

  state = {
    displayType: 'list',
  }

  setData = (page) => {
    const { user, limit } = this.props;
    const { fetchPropertiesByAgent } = this.props.actions;
    fetchPropertiesByAgent(user.id, page - 1, limit);
  }

  getPropertiesByAgent = () => {
    const { page } = this.props;
    this.setData(page);
  }

  handlePagination = (page) => {
    this.setData(page);
  }

  handleDisplayType = (displayType) => {
    this.setState({
      displayType,
    });
  }

  renderProperties = () => {
    const { displayType } = this.state;
    const { data } = this.props;
    const render = _.map(data, (item, key) => {
      return (
        <div className={displayType === 'thumbnail' ? 'col-md-3' : 'col-md-12'} key={key}>
          <div className="property-block">
            <PropertyItem type={displayType} item={item} mode="edit" />
          </div>
        </div>
      );
    });
    return render;
  }

  renderPagination = () => {
    const { page, total } = this.props;
    return (
      <div className="property-pagination">
        <Pagination current={page} total={total} onChange={this.handlePagination} />
      </div>
    );
  }

  render() {
    const { data, fetching, fetch, total, limit } = this.props;

    return (
      <div id="MyProperty">
        <div className="clearfix">
          <div className="pull-left">
            <div className="topic">
              <h1>รายการอสังหาฯที่ประกาศ</h1>
            </div>
          </div>
          {/* <div className="pull-right">
            <div className="display-type">
              <PropertyDisplayType active={displayType} onChange={this.handleDisplayType} />
            </div>
          </div> */}
        </div>
        <div className="property-list">
          <div className="row">
            <Spin spinning={fetching}>
              {fetch &&
                <div>
                  {_.size(data) > 0 ? (
                    <div>
                      {this.renderProperties()}
                      {total > limit &&
                        this.renderPagination()
                      }
                    </div>
                  ) : (
                    <Alert message="คุณยังไม่มีรายการประกาศ" type="info" />
                  )}
                </div>
              }
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
    data: state.domain.accountProperty.data,
    fetching: state.domain.accountProperty.fetching,
    fetch: state.domain.accountProperty.fetch,
    page: state.domain.accountProperty.page,
    limit: state.domain.accountProperty.limit,
    total: state.domain.accountProperty.total,
  };
};

const actions = {
  fetchPropertiesByAgent: PropertyActions.fetchPropertiesByAgent,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Property);

import React, { Component } from 'react';
import T from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Alert, Pagination } from 'antd';
// import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import * as PropertyActions from '../../../actions/property-actions';
// import RealEstateItem from '../../../components/RealEstateItem';
// import PropertyDisplayType from '../../../components/PropertyDisplayType';

import PropertyItem from '../../../modules/property/components/PropertyItem';

class Property extends Component {

  static propTypes = {
    actions: T.shape({
      fetchPropertiesByAgent: T.func,
    }).isRequired,
    user: T.shape().isRequired,
    fetching: T.bool.isRequired,
    result: T.string.isRequired,
    page: T.number.isRequired,
    limit: T.number.isRequired,
    total: T.number.isRequired,
  }

  constructor(props) {
    super(props);
    this.getPropertiesByAgent();
  }

  state = {
    displayType: 'list',
  }

  getPropertiesByAgent = () => {
    const { user, page, limit } = this.props;
    const { fetchPropertiesByAgent } = this.props.actions;
    fetchPropertiesByAgent(user.id, page - 1, limit);
  }

  handlePagination = (page) => {
    const { user, limit } = this.props;
    const { fetchPropertiesByAgent } = this.props.actions;
    fetchPropertiesByAgent(user.id, page - 1, limit);
  }

  handleDisplayType = (displayType) => {
    this.setState({
      displayType,
    });
  }

  render() {
    const { displayType } = this.state;
    const { properties, fetching, result, page, total, limit } = this.props;

    return (
      <div id="MyProperty">
        <div className="clearfix">
          <div className="pull-left">
            <div className="topic">
              <h1>รายการอสังหาฯของฉัน</h1>
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
              {result === 'ok' &&
                _.map(properties, (item, key) => {
                  return (
                    <div className={displayType === 'thumbnail' ? 'col-md-3' : 'col-md-12'} key={key}>
                      <div className="property-block">
                        <PropertyItem type={displayType} item={item} mode="edit" />
                      </div>
                    </div>
                  );
                })
              }
              {result === 'no' &&
                <Alert
                  message="คุณยังไม่มีรายการประกาศ"
                  type="info"
                />
              }
            </Spin>
          </div>
        </div>
        {total > limit &&
          <div className="property-pagination">
            <Pagination defaultCurrent={page} total={total} onChange={this.handlePagination} />
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.data,
    properties: state.domain.accountProperty.data,
    fetching: state.domain.accountProperty.fetching,
    result: state.domain.accountProperty.result,
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

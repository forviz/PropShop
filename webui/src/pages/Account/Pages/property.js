import React, { Component } from 'react';
import T from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notification, Spin, Alert, Pagination } from 'antd';
import numeral from 'numeral';
import _ from 'lodash';

import * as firebase from '../../../api/firebase';
import * as PropertyActions from '../../../actions/property-actions';

class Property extends Component {

  static propTypes = {
    actions: T.shape({
      fetchPropertiesByAgent: T.func,
    }).isRequired,
    user: T.shape().isRequired,
    properties: T.array.isRequired,
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

  render() {
    const { properties, fetching, result, page, total, limit } = this.props;

    return (
      <div id="MyProperty">
        <h1>รายการอสังหาฯของฉัน</h1>
        <div className="property-list">
          <div className="row">
            <Spin spinning={fetching}>
              {result === 'ok' &&
                _.map(properties, (value, key) => {
                  const imageStyle = {
                    backgroundImage: `url(${value.mainImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  };
                  return (
                    <div className="property-block" key={key}>
                      <div className="col-md-3">
                        <NavLink exact to={`/account/property?id=${value.id}`}>
                          <div className="thumbnail">
                            <div className="image" style={imageStyle} />
                            <div className="caption">
                              <p className="price">{numeral(value.price).format('0,0')} บาท</p>
                              <p className="project">{value.project || value.topic}</p>
                              <p className="address">{value.street || value.district || value.amphur} - {value.province}</p>
                            </div>
                          </div>
                        </NavLink>
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

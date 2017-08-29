import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Alert, Pagination } from 'antd';
import _ from 'lodash';

import * as WishlistActions from '../../../actions/wishlist-actions';
import PropertyItem from '../../../modules/property/components/PropertyItem';

class Wishlist extends Component {

  static propTypes = {
    actions: T.shape({
      fetchWishlistByAgent: T.func,
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
    this.getWishlistByAgent();
  }

  state = {
    displayType: 'list',
  }

  setData = (page) => {
    const { user, limit } = this.props;
    const { fetchWishlistByAgent } = this.props.actions;
    fetchWishlistByAgent(user.id, page - 1, limit);
  }

  getWishlistByAgent = () => {
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

  renderWishlist = () => {
    const { displayType } = this.state;
    const { data } = this.props;
    const render = _.map(data, (item, key) => {
      return (
        <div className={displayType === 'thumbnail' ? 'col-md-3' : 'col-md-12'} key={key}>
          <div className="wishlist-block">
            <PropertyItem type={displayType} item={item} mode="wishlist" />
          </div>
        </div>
      );
    });
    return render;
  }

  renderPagination = () => {
    const { page, total } = this.props;
    return (
      <div className="wishlist-pagination">
        <Pagination current={page} total={total} onChange={this.handlePagination} />
      </div>
    );
  }

  render() {
    const { data, fetching, fetch, total, limit } = this.props;

    return (
      <div id="MyWishlist">
        <div className="clearfix">
          <div className="pull-left">
            <div className="topic">
              <h1>รายการอสังหาฯที่บันทึกไว้</h1>
            </div>
          </div>
          {/* <div className="pull-right">
            <div className="display-type">
              <PropertyDisplayType active={displayType} onChange={this.handleDisplayType} />
            </div>
          </div> */}
        </div>
        <div className="wish-list">
          <div className="row">
            <Spin spinning={fetching}>
              {fetch &&
                <div>
                  {_.size(data) > 0 ? (
                    <div>
                      {this.renderWishlist()}
                      {total > limit &&
                        this.renderPagination()
                      }
                    </div>
                  ) : (
                    <Alert message="คุณยังไม่มีรายการที่บันทึกไว้" type="info" />
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
    data: state.domain.accountWishlist.account.data,
    fetching: state.domain.accountWishlist.account.fetching,
    fetch: state.domain.accountWishlist.account.fetch,
    page: state.domain.accountWishlist.account.page,
    limit: state.domain.accountWishlist.account.limit,
    total: state.domain.accountWishlist.account.total,
  };
};

const actions = {
  fetchWishlistByAgent: WishlistActions.fetchWishlistByAgent,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wishlist);

import React, { Component } from 'react';
import T from 'prop-types';

import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import cuid from 'cuid';

import BannerRealEstate from '../../containers/BannerRealEstate';

import LoadingComponent from '../../components/Loading';
import PropertyDisplayType from '../../components/PropertyDisplayType';

import {
  actions as PropertyActions,
  convertRouterPropsToParams,
  convertParamsToLocationObject,
  PropertyItem,
  PropertySearch,
} from '../../modules/property';

import { handleError } from '../../actions/errors';
import * as WishListActions from '../../actions/wishlist-actions';

const BREAKPOINT = 768;

const selectPropertyFromDomain = (state, domain) => {
  const domainReducer = _.get(state, `entities.properties.search.${domain}`);
  if (!domainReducer) return { result: [], total: 0 };

  return {
    ...domainReducer,
    result: _.map(domainReducer.result, propertyId => _.get(state, `entities.properties.entities.${propertyId}`)),
  };
};

const mapStateToProps = (state) => {
  return {
    banner: state.banners,
    landingItems: [
      {
        title: 'Condominium',
        ...selectPropertyFromDomain(state, 'landing-condo'),
      },
      {
        title: 'Home',
        ...selectPropertyFromDomain(state, 'landing-home'),
      },
    ],
    wishlist: state.domain.accountWishlist.data,
    user: state.user.data,
    mobileMode: state.core.mobileMode,
  };
};

const actions = {
  onInitPage: () => {
    return (dispatch) => {
      // Get all properties, with ID Only
      dispatch(PropertyActions.getLandingItems());
    };
  },
  getWishlist: WishListActions.getWishlist,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

const MapWrapper = styled.div`
  display: none;
  position: fixed;
  height: 100%;
  right: ${props => (props.hide ? '100%' : '0')};
  left: ${props => (props.hide ? '-100%' : '0')};
  visibility: ${props => (props.hide ? 'none' : 'visible')};
  transform: translateY(${props => (props.showFooter ? -props.showFooter : '0')}px);

  @media (min-width: ${BREAKPOINT}px) {
    display: block;
    right: auto;
    left: 0;
    width: 50%;
  }
`;

const ListWrapper = styled.div`
  // Mobile
  position: relative;
  background: white;
  // display: ${props => (props.mode === 'list' ? 'block' : 'none')};


  // Desktop
  @media (min-width: ${BREAKPOINT}px) {
    display: block;
    right: 0;
    left: 50%;
    width: 50%;
  }
`;


class Landing extends Component {

  static propTypes = {
    landingItems: T.arrayOf(T.shape({
      title: T.string,
      result: T.array,
    })),
    actions: T.shape({
      searchProperties: T.func,
    }).isRequired,
  }

  static defaultProps = {
    landingItems: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      mobileViewMode: 'map',
      currentPage: 1,
    };
  }

  state = {
    displayType: 'thumbnail',
    showFooter: 0,
    searchParameters: {
      location: undefined,
      bound: undefined,
      for: '',
      propertyType: [''],
      area: {
        name: 'bangkok',
      },
    },
  }

  componentWillMount() {
    this.handleShowFooter();
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleShowFooter);
    window.addEventListener('resize', this.handleShowFooter);
    const { onInitPage } = this.props.actions;
    onInitPage();
    this.settingWishlist();
  }

  componentDidUpdate() {
    this.pageHeight = document.getElementById('root').clientHeight;
    this.footerHeight = document.getElementById('Footer').clientHeight;
    this.screenHeight = this.pageHeight - window.innerHeight;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleShowFooter);
    window.removeEventListener('resize', this.handleShowFooter);
  }

  settingWishlist = async () => {
    const { user, wishlist } = this.props;
    const { getWishlist } = this.props.actions;
    const guestId = localStorage.guestId;
    if (!guestId) {
      localStorage.guestId = cuid();
    }

    if (_.isEmpty(wishlist)) {
      if (_.isEmpty(user)) {
        await getWishlist(localStorage.guestId);
      } else {
        await getWishlist(user.id);
      }
    }

    this.setLocalWishlist();
  }

  setLocalWishlist = () => {
    let localWishlist = [];
    if (localStorage.wishList) {
      localWishlist = JSON.parse(localStorage.wishList);
    }

    const { wishlist } = this.props;
    localStorage.wishList = '[]';
    _.map(wishlist, (value) => {
      localWishlist.push(value.id);
    });
    localStorage.wishList = JSON.stringify(_.union(localWishlist));
  }

  handleShowFooter = () => {
    if ((this.screenHeight - document.body.scrollTop) < this.footerHeight) {
      const padding = this.footerHeight - (this.screenHeight - document.body.scrollTop);
      this.setState({
        showFooter: padding,
      });
    } else {
      if (this.state.showFooter !== 0) {
        this.setState({
          showFooter: 0,
        });
      }
    }
  }

  delay = (() => {
    let timer = 0;
    return (callback, ms) => {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  toggleMobileViewMode = () => {
    const mobileViewMode = this.state.mobileViewMode;
    if (mobileViewMode === 'map') this.setState({ mobileViewMode: 'list' });
    else this.setState({ mobileViewMode: 'map' });
  }

  handleDisplayType = (displayType) => {
    this.setState({
      displayType,
    });
  }

  renderSearchFilter = (loading) => {
    const { history, areas } = this.props;
    const { searchParameters } = this.state;
    return (
      <div>
        {loading === true ? (
          <LoadingComponent />
        ) : (
          <PropertySearch
            activeTab="area"
            searchParameters={searchParameters}
            simpleMode
            trigger="none"
            page="home"
            onUpdate={params => this.setState({ searchParams: params })}
            onSubmit={params => history.push(convertParamsToLocationObject(params))}
          />
        )}
      </div>
    );
  }

  renderList = () => {
    const { displayType } = this.state;
    const { landingItems } = this.props;
    return (
      <div className="result">
        {/*<div className="pull-right">
          <div className="display-type">
            <PropertyDisplayType active={displayType} onChange={this.handleDisplayType} />
          </div>
        </div>*/}
        {
          _.map(landingItems, group =>
            (<div key={group.title} className="list clearfix">
              <h3>{group.title}</h3>
              <ul>
                {
                  _.map(group.result, (item, index) => {
                    const col = displayType === 'list' ? 'col-md-12' : 'col-sm-12 col-md-6 col-lg-4';
                    return (
                      <li key={`${group.title}-${index}`} className={`item ${col}`}>
                        {_.get(item, 'id') &&
                          <NavLink exact to={`/property/${item.id}`}>
                            <PropertyItem type={displayType} item={item} />
                          </NavLink>
                        }
                      </li>
                    );
                  })
                }
              </ul>
            </div>),
          )
        }
      </div>
    );
  }

  renderMobileScreen = () => {
    const { searchParameters } = this.props;
    const { mobileViewMode, showFooter } = this.state;

    return (
      <div id="Home">
        <MapWrapper showFooter={showFooter}>
          <BannerRealEstate />
        </MapWrapper>
        <ListWrapper mode={mobileViewMode}>
          {this.renderSearchFilter(false, searchParameters)}
          <hr />
          {this.renderList()}
        </ListWrapper>
      </div>
    );
  }

  renderSplitScreen = () => {
    const { searchParameters } = this.props;
    return (
      <div id="Home">
        <MapWrapper>
          <BannerRealEstate />
        </MapWrapper>
        <ListWrapper>
          {this.renderSearchFilter(false, searchParameters)}
          <hr />
          {this.renderList()}
        </ListWrapper>
      </div>
    );
  }

  render() {
    const { mobileMode } = this.props;

    if (mobileMode) return this.renderSplitScreen();

    // Mobile, Not split screen
    return this.renderMobileScreen();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);

import React, { Component } from 'react';
import T from 'prop-types';
import { Button } from 'antd';

import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import queryString from 'query-string';

import BannerRealEstate from '../../containers/BannerRealEstate';

import LoadingComponent from '../../components/Loading';
import RealEstateItem from '../../components/RealEstateItem';

import MapLocation from '../../components/Map/MapLocation';

import PropertySearch from '../../components/PropertySearch';

import * as UserActions from '../../actions/user-actions';
import * as RealestateActions from '../../actions/realestate-actions';
import * as ConfigActions from '../../actions/config-actions';

import * as firebase from '../../api/firebase';
import LandingPage from './LandingPage';
import { convertLocationToLatLngZoom, getDistance } from '../../helpers/map-helpers';

const BREAKPOINT = 768;

class SearchParameters {
  area: string;
  location: string;

  bound: string;
  bedroom: number;
  bathroom: number;
  price: {
    min: number;
    max: number;
  };
}

const convertRouterPropsToParams = (props, areaEntities) => {

  const search = queryString.parse(_.get(props, 'location.search', {}));
  // console.log('convertRouterPropsToParams', search);
  const areaSlug = _.get(props, 'match.params.area');
  return {
    area: areaSlug,
    location: _.get(areaEntities, `${areaSlug}.location`),
    for: _.replace(_.get(props, 'match.params.for'), 'for-', ''),
    propertyType: _.split(_.get(props, 'match.params.propertyType'), ','),

    // Query Parameters
    bound: _.get(search, 'bound'),
    bedroom: _.get(search, 'bedroom') ? _.toNumber(_.get(search, 'bedroom')) : undefined,
    bathroom: _.get(search, 'bathroom') ? _.toNumber(_.get(search, 'bathroom')) : undefined,
    price: _.get(search, 'price') ? {
      min: _.toNumber(_.head(_.split(_.get(search, 'price'), '-'))),
      max: _.toNumber(_.last(_.split(_.get(search, 'price'), '-'))),
    } : { min: undefined, max: undefined },
  };
};

const convertParamsToLocationObject = (params) => {
  return {
    pathname: `/${params.propertyType}/for-${params.for}/${params.area}/`,
    search: `?${queryString.stringify({
      bound: _.get(params, 'bound'),
      bedroom: _.get(params, 'bedroom'),
      bathroom: _.get(params, 'bathroom'),
      price: (_.get(params, 'price.min') || _.get(params, 'price.max')) ?
        `${_.get(params, 'price.min', '0')}-${_.get(params, 'price.max', '')}`
        :
        undefined,
    })}`,
  };
};

const convertParamsToSearchAPI = (params) => {
  console.log('convertParamsToSearchAPI', params, queryString.stringify(params));
  const str = queryString.stringify({
    // id: undefined,
    // ids: undefined,
    // query,
    for: params.for,
    propertyType: _.join(_.get(params, 'propertyType'), ','),
    bedroom: _.get(params, 'bedroom') ? _.toNumber(_.get(params, 'bedroom')) : undefined,
    bathroom: _.get(params, 'bathroom') ? _.toNumber(_.get(params, 'bathroom')) : undefined,
    priceMin: _.get(params, 'price.min') ? _.toNumber(_.get(params, 'price.min')) : undefined,
    priceMax: _.get(params, 'price.max') ? _.toNumber(_.get(params, 'price.max')) : undefined,
    bound: _.get(params, 'bound'),
    location: undefined,
    // select
  });

  return `?${str}`;
};


const mapStateToProps = (state, ownProps) => {
  const propertySearch = _.get(state, 'domain.propertySearch');
  const visibleIDs = propertySearch.visibleIDs;

  const properties = _.map(visibleIDs, id => _.get(state, `entities.properties.entities.${id}`));

  const areaEntities = _.get(state, 'entities.areas.entities');
  return {
    searchParameters: convertRouterPropsToParams(ownProps, areaEntities),
    areas: areaEntities,
    areaDataSource: _.map(_.groupBy(_.map(areaEntities, (a, key) => ({ ...a, key })), (area) => {
      return area.category;
    }), (areas, category) => ({ title: category, children: areas })),
    user: state.user.data,
    banner: state.banners,
    userDidSearch: true, // _.get(ownProps, 'location.search') !== '',
    realestate: {
      filter: _.get(ownProps, 'location.search') !== '',
      data: _.compact(properties),
      total: propertySearch.total,
    },
    configRealestate: state.config,
  };
};

const actions = {
  fetchUserProfile: UserActions.fetchUserProfile,
  searchProperties: RealestateActions.searchProperties,
  fetchConfigs: ConfigActions.fetchConfigs,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

const MapWrapper = styled.div`
  position: fixed;
  top:50px;
  bottom: 0px;
  right: ${props => props.hide ? '100%' : '0'};
  left: ${props => props.hide ? '-100%' : '0'};

  @media (min-width: ${BREAKPOINT}px) {
    right: auto;
    left: 0;
    width: 50%;
  }
`;

const ListWrapper = styled.div`
  // Mobile
  position: relative;
  background: white;
  display: ${props => props.mode === 'list' ? 'block' : 'none'};
  

  // Desktop
  @media (min-width: ${BREAKPOINT}px) {
    display: block;
    right: 0;
    left: 50%;
    width: 50%;
  }
`;

const ToggleButtonWrapper = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index:1;

  @media (min-width: ${BREAKPOINT}px) {
    display: none;
  }
`;

class Home extends Component {

  headerHeight: 0;

  static propTypes = {
    searchParameters: T.instanceOf(SearchParameters),
    userDidSearch: T.bool.isRequired,
    actions: T.shape({
      searchProperties: T.func,
    }).isRequired,
  }

  static defaultProps = {
    searchParameters: {
      area: undefined,
      location: undefined,
      bound: undefined,
    },
  }

  constructor(props) {
    super(props);
    this.getProfile(props);
    this.getConfig(props);

    this.state = {
      mobileViewMode: 'list',
    }
    // this.goFilter(props.location);
  }

  componentDidMount() {
    document.getElementById('Footer').style.visibility = 'hidden';
    document.addEventListener('scroll', this.handleScroll);
    this.headerHeight = document.getElementById('Header').clientHeight;

    const { searchProperties } = this.props.actions;
    // searchProperties(this.props.location.search);
    searchProperties(convertParamsToSearchAPI(this.props.searchParameters));
  }

  componentWillReceiveProps(nextProps) {
    // console.log('componentWillReceiveProps', this.props.searchParameters, nextProps.searchParameters);
    const { searchProperties } = nextProps.actions;
    if (!_.isEqual(nextProps.searchParameters, this.props.searchParameters)) {
      // const params = queryString.parse(nextProps.location.search);

      // if location is provide, convert to bound
      // console.log('searchparams', nextProps.searchParameters);
      // searchProperties(nextProps.location.search);
      searchProperties(convertParamsToSearchAPI(nextProps.searchParameters));
    }
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  getProfile = (props) => {
    firebase.core().auth().onAuthStateChanged((user) => {
      if (user) {
        const { fetchUserProfile } = props.actions;
        fetchUserProfile(user);
      }
    });
  }

  getConfig = (props) => {
    const { fetchConfigs } = props.actions;
    fetchConfigs();
  }

  handleScroll = () => {
    const scroolHeight = document.body.scrollTop + window.innerHeight;
    const bodyHeight = document.getElementsByClassName('layout-right')[0].clientHeight + this.headerHeight;
    if (scroolHeight >= bodyHeight) {
      document.getElementsByClassName('PropShop')[0].classList.add('end');
    } else {
      if (document.getElementsByClassName('PropShop')[0].classList.contains('end')) {
        document.getElementsByClassName('PropShop')[0].classList.remove('end');
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

  setUrl = (params) => {
    const { history } = this.props;
    console.log('setUrl', params, convertParamsToLocationObject(params));
    history.push(convertParamsToLocationObject(params));
  }

  handleMapBoundChanged = (map) => {
    const mapBound = map.getBounds();
    const ne = mapBound.getNorthEast().toJSON();
    const sw = mapBound.getSouthWest().toJSON();

    const center = map.getCenter();
    const zoom = map.getZoom();
    console.log('MapBoundChanged', ne, sw, center);

    const searchParameters = this.props.searchParameters;
    searchParameters.location = `${center.lat()},${center.lng()},${zoom}z`;
    searchParameters.bound = `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;


    // Check where is the nearest area of new center is
    const nearestArea = _.minBy(_.map(this.props.areas, (area, key) => ({ ...area, key })), (area) => {
      return getDistance(center.toJSON(), convertLocationToLatLngZoom(area.location));
    });

    if (nearestArea.key !== searchParameters.area) {
      searchParameters.area = nearestArea.key;
    }

    console.log('new searchParameters', searchParameters);
    this.setUrl(searchParameters);
  }

  toggleMobileViewMode = () => {
    const mobileViewMode = this.state.mobileViewMode;
    if (mobileViewMode === 'map') this.setState({ mobileViewMode: 'list' });
    else this.setState({ mobileViewMode: 'map' });
  }

  renderSearchFilter = (loading, searchParameters) => {
    return (
      <div>
        {loading === true ? (
          <LoadingComponent />
        ) : (
          <PropertySearch
            activeTab="area"
            searchParameters={searchParameters}
            onUpdate={this.setUrl}
          />
        )}
      </div>
    );
  }

  renderList = (loading, items) => {
    return (
      <div className="result">
        {loading === true ? (
          <LoadingComponent />
        ) : (
          <div className="list clearfix">
            <h3>{items.length} ผลการค้นหา</h3>
            <ul>
              {
                _.map(items, (item, index) => {
                  return (
                    <li key={index} className="item col-sm-4 col-lg-6 col-lg-4"><RealEstateItem item={item} type="sell" /></li>
                  );
                })
              }
            </ul>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { searchParameters, userDidSearch, banner, realestate, configRealestate, location } = this.props;
    const { mobileViewMode } = this.state;
    const showSplitContent = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;

    if (showSplitContent) {
      return (
        <div id="Home">
          <MapWrapper>
            <MapLocation
              location={searchParameters.location}
              nearby={realestate.data}
              onBoundChanged={this.handleMapBoundChanged}
            />
          </MapWrapper>
          <ListWrapper>
            {this.renderSearchFilter(false, searchParameters)}
            <hr />
            {this.renderList(realestate.loading, realestate.data)}
          </ListWrapper>
        </div>
      );
    }

    // Mobile, Not split screen
    return (
      <div id="Home">
        {
          <MapWrapper hide={mobileViewMode === 'list'}>
            <MapLocation
              location={searchParameters.location}
              nearby={realestate.data}
              onBoundChanged={this.handleMapBoundChanged}
            />
          </MapWrapper>
        }
        {
          (mobileViewMode === 'list') &&
            <ListWrapper mode={mobileViewMode}>
              {this.renderSearchFilter(false, searchParameters)}
              <hr />
              {this.renderList(realestate.loading, realestate.data)}
            </ListWrapper>
        }
        <ToggleButtonWrapper>
          <Button type="primary" size="large" shape="circle" icon="environment" onClick={this.toggleMobileViewMode} />
        </ToggleButtonWrapper>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

import React, { Component } from 'react';
import T from 'prop-types';

import { Button, Pagination } from 'antd';

import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

// import BannerRealEstate from '../../containers/BannerRealEstate';

import LoadingComponent from '../../components/Loading';
import MapLocation from '../../components/Map/MapLocation';

import {
  actions as PropertyActions,
  convertRouterPropsToParams,
  convertParamsToLocationObject,
  convertParamsToSearchAPI,
  PropertyItemMini,
  PropertyItemThumbnail,
  PropertySearch,
} from '../../modules/property';

import Slider from '../../components/Slider';
import { handleError } from '../../actions/errors';

// import * as RealestateActions from '../../actions/realestate-actions';
import * as ConfigActions from '../../actions/config-actions';

const BREAKPOINT = 768;
const PAGE_SIZE = 30;

class SearchParameters {
  area: object;

  bound: string;
  bedroom: number;
  bathroom: number;
  price: {
    min: number;
    max: number;
  };

  skip: number;
}

const mapStateToProps = (state, ownProps) => {
  const propertySearch = _.get(state, 'entities.properties.search.home');
  const visibleIDs = propertySearch.result;

  const properties = _.map(visibleIDs, id => _.get(state, `entities.properties.entities.${id}`));
  const areaEntities = _.get(state, 'entities.areas.entities');
  // console.log('mapStateToProps', convertRouterPropsToParams(ownProps, areaEntities));
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
      loading: propertySearch.loading,
      filter: _.get(ownProps, 'location.search') !== '',
      data: _.compact(properties),
      total: propertySearch.total,
    },
    configRealestate: state.config,
  };
};

const actions = {
  searchProperties: (param) => {
    return (dispatch) => {
      // Get all properties, with ID Only
      dispatch(PropertyActions.search(param, 'home'))
      .then(() => {
        console.log('SEARCH COMPLETE');
      })
      .catch((error) => {
        dispatch(handleError(error));
      });
    };
  },
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
  visibility: ${props => props.hide ? 'none' : 'visible'};

  @media (min-width: ${BREAKPOINT}px) {
    right: auto;
    left: 0;
    width: 50%;
  }
`;

const SliderWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  height: 100px;
  width: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.4);
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
  bottom: 120px;
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
    this.getConfig(props);

    this.state = {
      mobileViewMode: 'map',
      currentPage: 1,
    };
    // this.goFilter(props.location);
  }

  handleResize = () => {
    const showSplitContent = window.matchMedia(`(min-width: ${BREAKPOINT}px)`).matches;
    if (showSplitContent !== this.state.showSplitContent) {
      this.setState({
        showSplitContent,
      });
    }
  }

  componentWillMount() {
    this.handleResize();
  }

  componentDidMount() {
    document.getElementById('Footer').style.visibility = 'hidden';
    window.addEventListener('resize', this.handleResize);
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
    window.addEventListener('resize', this.handleResize);
    document.removeEventListener('scroll', this.handleScroll);
  }

  getConfig = (props) => {
    const { fetchConfigs } = props.actions;
    fetchConfigs();
  }

  handleScroll = () => {
    // const scroolHeight = document.body.scrollTop + window.innerHeight;
    // const bodyHeight = document.getElementsByClassName('layout-right')[0].clientHeight + this.headerHeight;
    // if (scroolHeight >= bodyHeight) {
    //   document.getElementsByClassName('PropShop')[0].classList.add('end');
    // } else {
    //   if (document.getElementsByClassName('PropShop')[0].classList.contains('end')) {
    //     document.getElementsByClassName('PropShop')[0].classList.remove('end');
    //   }
    // }
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
    history.push(convertParamsToLocationObject(params));
  }

  handleMapBoundChanged = (map) => {
    const mapBound = map.getBounds();
    const ne = mapBound.getNorthEast().toJSON();
    const sw = mapBound.getSouthWest().toJSON();

    const center = map.getCenter();
    const zoom = map.getZoom();
    console.log('MapBoundChanged', ne, sw, center);
    /*
    const searchParameters = this.props.searchParameters;
    // searchParameters.location = `${center.lat()},${center.lng()},${zoom}z`;
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
    */
  }

  toggleMobileViewMode = () => {
    const mobileViewMode = this.state.mobileViewMode;
    if (mobileViewMode === 'map') this.setState({ mobileViewMode: 'list' });
    else this.setState({ mobileViewMode: 'map' });
  }

  onChangeListPage = (page, pageSize) => {
    this.setState({ currentPage: page });
    const { searchProperties } = this.props.actions;
    const searchParameters = _.clone(this.props.searchParameters);
    searchParameters.skip = (page - 1) * pageSize;
    searchProperties(convertParamsToSearchAPI(searchParameters));
  }

  renderSearchFilter = (loading, searchParameters) => {
    const { areaDataSource } = this.props;
    return (
      <div>
        {loading === true ? (
          <LoadingComponent />
        ) : (
          <PropertySearch
            activeTab="area"
            searchParameters={searchParameters}
            areaDataSource={areaDataSource}
            onUpdate={this.setUrl}
          />
        )}
      </div>
    );
  }

  renderList = (loading, items, total) => {
    return (
      <div className="result">
        {loading === true ? (
          <LoadingComponent />
        ) : (
          <div className="list clearfix">
            <h3>แสดง {items.length} รายการจาก {total} ผลการค้นหา</h3>
            <ul>
              {
                _.map(items, (item, index) => {
                  return (
                    <li key={index} className="item col-sm-4 col-lg-6 col-lg-4">
                      <PropertyItemThumbnail item={item} />
                    </li>
                  );
                })
              }
            </ul>
            <Pagination current={this.state.currentPage} onChange={this.onChangeListPage} pageSize={PAGE_SIZE} total={total} />
          </div>
        )}
      </div>
    );
  }

  renderMobileScreen = () => {
    const { searchParameters, realestate } = this.props;
    const { mobileViewMode } = this.state;

    return (
      <div id="Home">
        {
          <MapWrapper hide={mobileViewMode === 'list'}>
            <MapLocation
              area={searchParameters.area}
              nearby={realestate.data}
              onBoundChanged={this.handleMapBoundChanged}
            />
            {
              _.size(realestate.data) > 0 &&
                <SliderWrapper>
                  <Slider>
                    {
                      _.map(realestate.data, (item) => {
                        return (
                          <PropertyItemMini key={item.id} {...item} />
                        );
                      })
                    }
                  </Slider>
                </SliderWrapper>
            }
          </MapWrapper>

        }
        {
          (mobileViewMode === 'list') &&
            <ListWrapper mode={mobileViewMode}>
              {this.renderSearchFilter(false, searchParameters)}
              <hr />
              {this.renderList(realestate.loading, realestate.data, realestate.total)}
            </ListWrapper>
        }
        <ToggleButtonWrapper>
          <Button type="primary" size="large" shape="circle" icon="environment" onClick={this.toggleMobileViewMode} />
        </ToggleButtonWrapper>
      </div>
    );
  }

  renderSplitScreen = () => {
    const { searchParameters, realestate } = this.props;
    return (
      <div id="Home">
        <MapWrapper>
          <MapLocation
            area={searchParameters.area}
            nearby={realestate.data}
            onBoundChanged={this.handleMapBoundChanged}
          />
        </MapWrapper>
        <ListWrapper>
          {this.renderSearchFilter(false, searchParameters)}
          <hr />
          {this.renderList(realestate.loading, realestate.data, realestate.total)}
        </ListWrapper>
      </div>
    );
  }

  render() {
    const { showSplitContent } = this.state;

    if (showSplitContent) return this.renderSplitScreen();

    // Mobile, Not split screen
    return this.renderMobileScreen();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);

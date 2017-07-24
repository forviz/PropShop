import React, { Component } from 'react';
import T from 'prop-types';

import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import BannerRealEstate from '../../containers/BannerRealEstate';

import LoadingComponent from '../../components/Loading';

import {
  actions as PropertyActions,
  convertRouterPropsToParams,
  convertParamsToLocationObject,
  convertParamsToSearchAPI,
  PropertyItemThumbnail,
  PropertySearch,
} from '../../modules/property';

import { handleError } from '../../actions/errors';

const BREAKPOINT = 768;

const selectPropertyFromDomain = (state, domain) => {
  const domainReducer = _.get(state, `entities.properties.search.${domain}`);
  if (!domainReducer) return { result: [], total: 0 };

  return {
    ...domainReducer,
    result: _.map(domainReducer.result, propertyId => _.get(state, `entities.properties.entities.${propertyId}`)),
  };
};

const mapStateToProps = (state, ownProps) => {
  const propertySearch = _.get(state, 'entities.properties.search.home');
  const visibleIDs = propertySearch.result;

  const properties = _.map(visibleIDs, id => _.get(state, `entities.properties.entities.${id}`));
  const areaEntities = _.get(state, 'entities.areas.entities');
  const areas = _.map(_.get(state, 'entities.areas.entities'), (area, slug) => {
    return {
      ...area,
      label: _.get(area, 'title.th'),
      value: slug,
    };
  });

  return {
    searchParameters: convertRouterPropsToParams(ownProps, areaEntities),
    areas,
    banner: state.banners,
    landingItems: [
      {
        title: 'Condo',
        ...selectPropertyFromDomain(state, 'landing-condo'),
      },
      {
        title: 'Home',
        ...selectPropertyFromDomain(state, 'landing-home'),
      },
    ],
  };
};

const actions = {
  onInitPage: () => {
    return (dispatch) => {
      // Get all properties, with ID Only
      dispatch(PropertyActions.getLandingItems());
    };
  },
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
  right: ${props => (props.hide ? '100%' : '0')};
  left: ${props => (props.hide ? '-100%' : '0')};
  visibility: ${props => (props.hide ? 'none' : 'visible')};

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
  display: ${props => (props.mode === 'list' ? 'block' : 'none')};


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
    searchParameters: T.shape({
      bound: T.string,
      bedroom: T.number,
      bathroom: T.number,
      price: T.shape({
        min: T.number,
        max: T.number,
      }),
      skip: T.number,
    }),
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

    this.state = {
      mobileViewMode: 'map',
      currentPage: 1,
    };
  }


  componentDidMount() {
    document.getElementById('Footer').style.visibility = 'hidden';
    this.headerHeight = document.getElementById('Header').clientHeight;

    const { onInitPage } = this.props.actions;
    onInitPage();
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

  renderSearchFilter = (loading, searchParameters) => {
    const { history, areas } = this.props;
    return (
      <div>
        {loading === true ? (
          <LoadingComponent />
        ) : (
          <PropertySearch
            activeTab="area"
            searchParameters={searchParameters}
            areas={areas}
            onUpdate={params => history.push(convertParamsToLocationObject(params))}
          />
        )}
      </div>
    );
  }

  renderList = () => {
    const { landingItems } = this.props;
    return (
      <div className="result">
        {
          _.map(landingItems, group =>
            (<div className="list clearfix">
              <h3>{group.title}</h3>
              <ul>
                {
                  _.map(group.result, (item, index) => {
                    return (
                      <li key={index} className="item col-sm-4 col-lg-6 col-lg-4">
                        <PropertyItemThumbnail item={item} />
                      </li>
                    );
                  })
                }
              </ul>
            </div>)
          )
        }
      </div>
    );
  }

  renderMobileScreen = () => {
    const { searchParameters, realestate } = this.props;
    const { mobileViewMode } = this.state;

    return (
      <div id="Home">
        <MapWrapper>
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
    const { searchParameters, realestate } = this.props;
    return (
      <div id="Landing">
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
    const { showSplitContent } = this.state;
    
    if (showSplitContent) return this.renderSplitScreen();

    // Mobile, Not split screen
    return this.renderMobileScreen();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Landing);

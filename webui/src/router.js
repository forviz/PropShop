import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import Header from './containers/Header';
import Footer from './containers/Footer';

import Landing from './pages/Landing';
import PropertySearchPage from './pages/PropertySearchPage';
import Realestate from './pages/Realestate';
import Sell from './pages/Sell';
import Agent from './pages/Agent';
import News from './pages/News';
import Login from './pages/Login';
import Register from './pages/Register';
import Forgotpassword from './pages/Forgotpassword';
import Account from './pages/Account';

import * as UserActions from './actions/user-actions';

const routes = [
  { path: '/',
    exact: true,
    header: Header,
    content: Landing,
    footer: Footer,
  },
  { path: '/:propertyType/:for/:area/',
    exact: true,
    header: Header,
    content: PropertySearchPage,
    footer: Footer,
  },
  { path: '/realestate/:id',
    exact: false,
    header: Header,
    content: Realestate,
    footer: Footer,
  },
  { path: '/sell',
    exact: false,
    header: Header,
    content: Sell,
    footer: Footer,
  },
  { path: '/agent',
    exact: false,
    header: Header,
    content: Agent,
    footer: Footer,
  },
  { path: '/login',
    exact: false,
    header: Header,
    content: Login,
  },
  { path: '/register',
    exact: false,
    header: Header,
    content: Register,
  },
  { path: '/forgotpassword',
    exact: false,
    header: Header,
    content: Forgotpassword,
  },
  { path: '/news',
    exact: false,
    header: Header,
    content: News,
    footer: Footer,
  },
  { path: '/account/:page',
    exact: false,
    header: Header,
    content: Account,
    footer: Footer,
  },
];

class MyRouter extends Component {

  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    actions: PropTypes.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.getProfile();
  }

  getProfile = () => {
    const { firebase } = this.props;
    const { fetchUserData } = this.props.actions;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user.uid);
      }
    });
  }

  render() {
    return (
      <Router>
        <div className="Router">
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.header}
            />
          ))}
          <div id="Content">
            {routes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                exact={route.exact}
                component={route.content}
              />
            ))}
          </div>
          {routes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              exact={route.exact}
              component={route.footer}
            />
          ))}
        </div>
      </Router>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const actions = {
  fetchUserData: UserActions.fetchUserData,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(MyRouter);

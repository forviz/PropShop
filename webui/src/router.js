import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { notification } from 'antd';
import _ from 'lodash';

import Header from './containers/Header';
import Footer from './containers/Footer';

import Landing from './pages/Landing';
import PropertySearchPage from './pages/PropertySearchPage';
import Property from './pages/Property';
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
    login: false,
  },
  { path: '/:propertyType/:for/:area/',
    exact: true,
    header: Header,
    content: PropertySearchPage,
    footer: Footer,
    login: false,
  },
  { path: '/property/:id',
    exact: false,
    header: Header,
    content: Property,
    footer: Footer,
    login: false,
  },
  { path: '/sell',
    exact: false,
    header: Header,
    content: Sell,
    footer: Footer,
    login: true,
  },
  { path: '/agent',
    exact: false,
    header: Header,
    content: Agent,
    footer: Footer,
    login: false,
  },
  { path: '/login',
    exact: false,
    header: Header,
    content: Login,
    login: false,
  },
  { path: '/register',
    exact: false,
    header: Header,
    content: Register,
    login: false,
  },
  { path: '/forgotpassword',
    exact: false,
    header: Header,
    content: Forgotpassword,
    login: false,
  },
  { path: '/news',
    exact: false,
    header: Header,
    content: News,
    footer: Footer,
    login: false,
  },
  { path: '/account/:page',
    exact: false,
    header: Header,
    content: Account,
    footer: Footer,
    login: true,
  },
];

const PrivateRoute = ({ component: MyComponent, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      rest.isAuthenticated ? (
        <MyComponent {...props} />
      ) : (
        <div>
          {notification.error({ message: 'กรุณาเข้าสู่ระบบก่อน' })}
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        </div>
      )
    )}
  />
);

class MyRouter extends Component {

  static propTypes = {
    firebase: PropTypes.shape().isRequired,
    actions: PropTypes.shape().isRequired,
  }

  constructor(props) {
    super(props);
    this.getProfile();
  }

  state = {
    isAuthenticated: false,
    renderOk: false,
  }

  getProfile = () => {
    const _self = this;
    const { firebase } = this.props;
    const { fetchUserData } = this.props.actions;
    firebase.auth().onAuthStateChanged((user) => {
      if (_.get(user, 'emailVerified')) fetchUserData(_.get(user, 'uid'));
      _self.setState({
        isAuthenticated: _.get(user, 'emailVerified') ? true : false,
        renderOk: true,
      });
    });
  }

  render() {
    if (!this.state.renderOk) return <div />;
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
              <div>
                {route.login === true ? (
                  <PrivateRoute
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    component={route.content}
                    isAuthenticated={this.state.isAuthenticated}
                  />
                ) : (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact}
                    component={route.content}
                  />
                )}
              </div>
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

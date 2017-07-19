import React, { Component } from 'react';
import T from 'prop-types';

import Property from './property';
import PropertyEdit from './property-edit';
import Profile from './profile';
import Changepassword from './changepassword';
import Wishlist from './wishlist';


class Pages extends Component {

  static propTypes = {
    page: T.string.isRequired,
    param: T.shape().isRequired,
    history: T.shape().isRequired,
  }

  getPage = (page, param, history) => {
    switch (page) {
      case 'property': {
        if (param.id) {
          return <PropertyEdit id={param.id} />;
        }
        return <Property history={history} />;
      }
      case 'profile': return <Profile param={param} />;
      case 'changepassword': return <Changepassword param={param} />;
      case 'wishlist': return <Wishlist param={param} />;
      default: return <Property param={param} />;
    }
  }

  render() {
    const { page, param, history } = this.props;
    return (
      <div id="Pages">
        {this.getPage(page, param, history)}
      </div>
    );
  }
}

export default Pages;

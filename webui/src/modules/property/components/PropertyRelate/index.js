import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import _ from 'lodash';

import { getProperties } from '../../api';
import PropertyItem from '../../components/PropertyItem';

class PropertyRelate extends Component {

  static propTypes = {
    param: T.string.isRequired,
  }

  static defaultProps = {
    param: '',
  }

  constructor(props) {
    super(props);
    this.getPropertyRelate();
  }

  state = {
    data: [],
  }

  getPropertyRelate = async () => {
    const { param } = this.props;
    const properties = await getProperties(param);
    this.setState({
      data: properties.data,
    });
  }

  getData = () => {
    const { data } = this.state;
    const col = Math.round(12 / _.size(data));
    const result = _.map(data, (value) => {
      return (
        <div key={value.id} className={`col-md-${col}`}>
          <a href={`#/property/${value.id}`} target="_blank"><PropertyItem item={value} /></a>
        </div>
      );
    });
    return result;
  }

  render() {
    return (
      <div className="PropertyRelate">
        <div className="row">
          {this.getData()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {

  };
};

const actions = {

};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default compose(firebaseConnect(), connect(mapStateToProps, mapDispatchToProps))(PropertyRelate);

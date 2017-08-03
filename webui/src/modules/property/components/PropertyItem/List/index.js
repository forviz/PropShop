import React, { Component } from 'react';
import T from 'prop-types';

import PropertyListViewMode from './View';
import PropertyListEditMode from './Edit';

class PropertyItemList extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    mode: T.string.isRequired,
  }

  getPropertyMode = () => {
    const { mode, item } = this.props;
    switch (mode) {
      case 'view': return <PropertyListViewMode item={item} />;
      case 'edit': return <PropertyListEditMode item={item} />;
      default: return <PropertyListViewMode item={item} />;
    }
  }

  render() {
    return (
      <div className="PropertyItemList">
        {this.getPropertyMode()}
      </div>
    );
  }
}

export default PropertyItemList;

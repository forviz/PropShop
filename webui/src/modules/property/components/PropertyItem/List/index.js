import React, { Component } from 'react';
import T from 'prop-types';

import PropertyListViewMode from './View';
import PropertyListEditMode from './Edit';

class PropertyItemList extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    mode: T.string.isRequired,
    onMouseEnter: T.func,
    onMouseLeave: T.func,
  }

  getPropertyMode = () => {
    const { mode, item, onMouseEnter, onMouseLeave } = this.props;
    switch (mode) {
      case 'view': return <PropertyListViewMode item={item} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
      case 'edit': return <PropertyListEditMode item={item} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
      default: return <PropertyListViewMode item={item} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
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

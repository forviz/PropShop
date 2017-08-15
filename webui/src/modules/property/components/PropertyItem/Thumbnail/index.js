import React, { Component } from 'react';
import T from 'prop-types';

import PropertyThumbnailViewMode from './View';
import PropertyThumbnailEditMode from './Edit';

class PropertyItemThumbnail extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    mode: T.string.isRequired,
    onMouseEnter: T.func,
    onMouseLeave: T.func,
  }

  getPropertyMode = () => {
    const { mode, item, onMouseEnter, onMouseLeave } = this.props;
    switch (mode) {
      case 'view': return <PropertyThumbnailViewMode item={item} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
      case 'edit': return <PropertyThumbnailEditMode item={item} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
      default: return <PropertyThumbnailViewMode item={item} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
    }
  }

  render() {
    return (
      <div className="PropertyItemThumbnail">
        {this.getPropertyMode()}
      </div>
    );
  }
}

export default PropertyItemThumbnail;

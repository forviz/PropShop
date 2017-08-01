import React, { Component } from 'react';
import T from 'prop-types';

import PropertyThumbnailViewMode from './View';
import PropertyThumbnailEditMode from './Edit';

class PropertyItemThumbnail extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    mode: T.string.isRequired,
  }

  getPropertyMode = () => {
    const { mode, item } = this.props;
    switch (mode) {
      case 'view': return <PropertyThumbnailViewMode item={item} />;
      case 'edit': return <PropertyThumbnailEditMode item={item} />;
      default: return <PropertyThumbnailViewMode item={item} />;
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

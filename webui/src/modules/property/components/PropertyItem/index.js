import React, { Component } from 'react';
import T from 'prop-types';

import PropertyThumbnail from './Thumbnail';
import PropertyList from './List';
import PropertyMini from './Mini';

class PropertyItem extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    type: T.string.isRequired,
  }

  getPropertyItem = () => {
    const { type, item } = this.props;
    switch (type) {
      case 'thumbnail': return <PropertyThumbnail item={item} />;
      case 'list': return <PropertyList item={item} />;
      case 'mini': return <PropertyMini item={item} />;
      default: return <PropertyThumbnail item={item} />;
    }
  }

  render() {
    return (
      <div className="PropertyItem">
        {this.getPropertyItem()}
      </div>
    );
  }
}

export default PropertyItem;

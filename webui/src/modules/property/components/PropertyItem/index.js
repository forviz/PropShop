import React, { Component } from 'react';
import T from 'prop-types';

import PropertyThumbnail from './Thumbnail';
import PropertyList from './List';
import PropertyMini from './Mini';

class PropertyItem extends Component {

  static defaultProps = {
    mode: 'view',
  }

  static propTypes = {
    item: T.shape().isRequired,
    type: T.string,
    mode: T.string.isRequired,
    onMouseEnter: T.func,
    onMouseLeave: T.func,
  }

  getPropertyItem = () => {
    const { type, mode, item, onMouseEnter, onMouseLeave } = this.props;
    switch (type) {
      case 'thumbnail': return <PropertyThumbnail item={item} mode={mode} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
      case 'list': return <PropertyList item={item} mode={mode} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
      case 'mini': return <PropertyMini item={item} mode={mode} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
      default: return <PropertyThumbnail item={item} mode={mode} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
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

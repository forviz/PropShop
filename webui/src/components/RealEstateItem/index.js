import React, { Component } from 'react';
import T from 'prop-types';

import RealEstateThumbnail from './thumbnail';
import RealEstateList from './list';

class RealEstateItem extends Component {

  static propTypes = {
    item: T.shape().isRequired,
    type: T.string.isRequired,
  }

  getRealEstateItem = () => {
    const { type, item } = this.props;
    switch (type) {
      case 'thumbnail': return <RealEstateThumbnail item={item} />;
      case 'list': return <RealEstateList item={item} />;
      default: return <RealEstateThumbnail item={item} />;
    }
  }

  render() {
    return (
      <div className="RealEstateItem">
        {this.getRealEstateItem()}
      </div>
    );
  }
}

export default RealEstateItem;

import React, { Component } from 'react';
import Thumbnail from './Thumbnail';
import Wish from '../../../../components/Wish';

class ThumbnailWithWish extends Component {

  render() {
    const { item } = this.props;
    return (
      <div>
        <Thumbnail {...this.props} />
        <div className="overlay">
          <Wish item={item} />
        </div>
      </div>
    );
  }
}

export default ThumbnailWithWish;

import React, { Component } from 'react';
import _ from 'lodash';

import NewsItemList from './NewsItemList';

class NewsItem extends Component {

  render() {
    const { datas } = this.props;

    return (
      <div className="NewsItem">
        <div className="row">
          {
            _.map(datas, (data, key) => {
              return (
                <NewsItemList data={data} key={key} />
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default NewsItem;

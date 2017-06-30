import React, { Component } from 'react';
import _ from 'lodash';

class HotNews extends Component {
  render() {
    const { datas } = this.props;

    return (
      <div className="HotNews">
        <div className="title">ข่าว-บทความยอดนิยม</div>
        {
          _.map(datas, (data, key) => {
            return (
              <div key={key} className="list">
                <a href={data.redirectURL} className="text">{data.text}</a>
                <div className="date">{data.date}</div>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default HotNews;

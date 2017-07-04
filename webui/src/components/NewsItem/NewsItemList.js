import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';
import T from 'prop-types';
import moment from 'moment';

function strip(html) {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

class NewsItem extends Component {

  static propTypes = {
    data: T.shape().isRequired,
    key: T.string.isRequired,
  }

  render() {
    const { data, key } = this.props;

    if (_.isEmpty(data)) return <Spin />;

    const title = strip(data.title.rendered);
    const description = strip(data.acf.content);

    const getDate = moment(data.date).locale('th').format('DD MMM YYYY');

    return (
      <div key={key} className="list col-md-4">
        <div className="image">
          <a href={data.link} target="_blank">
            <img src={data.acf.thumbnail_image} alt="" />
          </a>
        </div>
        <div className="title">{title}
        </div>
        <div className="date">
          {getDate}
        </div>
        <div className="description">
          {description}
        </div>
        <a href={data.link} target="_blank" className="seemore">
          อ่านต่อ
        </a>
      </div>
    );
  }
}

export default NewsItem;

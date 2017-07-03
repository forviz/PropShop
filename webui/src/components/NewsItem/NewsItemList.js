import React, { Component } from 'react';
import { Spin } from 'antd';
import _ from 'lodash';
import T from 'prop-types';

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

    const date = new Date(data.date);
    // const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    //   'July', 'August', 'September', 'October', 'November', 'December',
    // ];
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
    ];

    const title = strip(data.title.rendered);
    const description = strip(data.acf.content);
    const getDate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

    return (
      <div key={key} className="list col-md-6">
        <div className="image">
          <a href={data.link} target="_blank">
            <img src={data.acf.banner_images.sizes.medium_large} alt="" />
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

import React, { Component } from 'react';

class NewsItem extends Component {

  render() {
    const { data, key } = this.props;

    return (
      <div key={key} className="list col-md-6">
        <div className="image">
          <img src={data.image} alt="" />
        </div>
        <div className="title">{data.title}
        </div>
        <div className="date">
          {data.date}
        </div>
        <div className="description">
          {data.description}
        </div>
        <a href="###" className="seemore">
          อ่านต่อ
        </a>
      </div>
    );
  }
}

export default NewsItem;

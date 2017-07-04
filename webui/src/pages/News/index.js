import React, { Component } from 'react';
import { Tabs, Pagination, Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import _ from 'lodash';
import queryString from 'query-string';
import FontAwesome from 'react-fontawesome';
import T from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewsBanner from '../../components/NewsBanner';
import NewsItem from '../../components/NewsItem';
import HotNews from '../../components/HotNews';

import { getNewsProp, getNewsBanner } from '../../actions/news-actions';

const TabPane = Tabs.TabPane;

class News extends Component {

  static propTypes = {
    history: T.arrayOf().isRequired,
    location: T.arrayOf().isRequired,
    actions: T.arrayOf(T.shape({
      getNewsProp: T.func,
    })).isRequired,
    newsItem: T.arrayOf(T.shape({
      entities: T.shape(),
      propNow: T.shape(),
      propTalk: T.shape(),
      propVerdict: T.shape(),
      newsBanner: T.shape(),
    })).isRequired,
    fetching: T.boolean().isRequired,
  }

  constructor(props) {
    super(props);
    this.props.actions.getNewsProp('prop-now', '1');
    this.props.actions.getNewsBanner('prop-now');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.goFilter(nextProps.location);
    }
  }

  handleTab = (key) => {
    const { history } = this.props;

    const param = {
      content: key,
      page: 1,
    };
    const stringify = queryString.stringify(param);
    history.push({
      search: `?${stringify}`,
    });
  };

  handlePage = (page) => {
    const { search } = this.props.location;
    const { history } = this.props;

    let param = queryString.parse(search);

    if (_.isEmpty(param.content)) param.content = 'prop-now';

    param = {
      content: param.content,
      page,
    };
    const stringify = queryString.stringify(param);

    history.push({
      search: `?${stringify}`,
    });
  }

  goFilter = (location) => {
    const search = location.search;
    if (search) {
      const param = queryString.parse(search);
      this.props.actions.getNewsProp(param.content, param.page);
      this.props.actions.getNewsBanner(param.content);
    }
  }

  render() {
    const { propNow, propTalk, propVerdict, newsBanner } = this.props.newsItem.entities;
    const { fetching } = this.props;

    if (Object.keys(this.props.newsItem.entities).length === 0) return <div />;

    // const hotNews = [
    //   {
    //     text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
    //     date: '16 มิ.ย. 2560',
    //     redirectURL: '###',
    //   },
    //   {
    //     text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
    //     date: '16 มิ.ย. 2560',
    //     redirectURL: '###',
    //   },
    //   {
    //     text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
    //     date: '16 มิ.ย. 2560',
    //     redirectURL: '###',
    //   },
    //   {
    //     text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
    //     date: '16 มิ.ย. 2560',
    //     redirectURL: '###',
    //   },
    //   {
    //     text: '[ดวงรายสัปดาห์]กูรู12ราศี: ประจำวันที่ 19 - 25 มิถุนายน 2560',
    //     date: '16 มิ.ย. 2560',
    //     redirectURL: '###',
    //   },
    // ];

    return (
      <div id="News">
        <div className="container">

          <div className="breadcrumb">
            <div className="breadcrumb-item"><NavLink exact to="/">หน้าแรก <FontAwesome name="angle-right" /></NavLink></div>
            <div className="breadcrumb-item">ข่าวสารและบทความ</div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <NewsBanner datas={newsBanner.datas} />
            </div>
          </div>
          <div className="row">
            <Spin tip="Loading..." spinning={fetching}>
              <div className="col-md-12">
                <Tabs defaultActiveKey="prop-now" onChange={this.handleTab}>
                  <TabPane tab="PROP NOW" key="prop-now">
                    <div className="tap-title">PROP NOW</div>
                    {
                      _.isEmpty(propNow) ? <div className="box-spin"><Spin /></div> : ''
                    }
                    {propNow &&
                      <div>
                        <NewsItem datas={propNow.datas} />
                        <Pagination
                          defaultCurrent={1}
                          total={propNow.total}
                          onChange={this.handlePage}
                        />
                      </div>
                    }
                  </TabPane>
                  <TabPane tab="PROP TALK" key="prop-talk">
                    <div className="tap-title">PROP TALK</div>
                    {
                      _.isEmpty(propTalk) ? <div className="box-spin"><Spin /></div> : ''
                    }
                    {propTalk &&
                      <div>
                        <NewsItem datas={propTalk.datas} />
                        <div className="col-md-12">
                          <Pagination defaultCurrent={1} total={propTalk.total} onChange={this.handlePage} />
                        </div>
                      </div>
                    }
                  </TabPane>
                  <TabPane tab="PROP VERDICT" key="prop-verdict">
                    <div className="tap-title">PROP VERDICT</div>
                    {
                      _.isEmpty(propVerdict) ? <div className="box-spin"><Spin /></div> : ''
                    }
                    {propVerdict &&
                      <div>
                        <NewsItem datas={propVerdict.datas} />
                        <div className="col-md-12">
                          <Pagination defaultCurrent={1} total={propVerdict.total} onChange={this.handlePage} />
                        </div>
                      </div>
                    }
                  </TabPane>
                </Tabs>
              </div>
            </Spin>
            {/*
            <div className="col-md-4">
              <HotNews datas={hotNews} />
            </div>
            */}
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log('STATEEEEEEEEEEEEE', state.entities.news);
  return {
    newsItem: state.entities.news,
    fetching: state.entities.news.fetching,
  };
};

const actions = {
  getNewsProp,
  getNewsBanner,
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(News);

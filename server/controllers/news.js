const fetch = require('node-fetch');
import _ from 'lodash';

export const getNews = async (req, res) => {
  let tabName = 'prop-now';
  let page = 1;
  let perPage = 10;

  const query = req.query;

  if (_.get(query, 'tabName')) tabName = query.tabName;
  if (_.get(query, 'page')) page = query.page;
  if (_.get(query, 'perPage')) perPage = query.perPage;

  let total = '';
  let tab = '';

  if (tabName === 'prop-now') tab = 'propNow';
  else if (tabName === 'prop-talk') tab = 'propTalk';
  else if (tabName === 'prop-verdict') tab = 'propVerdict';

  const result = await fetch(`http://propholic.com/wp-json/wp/v2/${tabName}?page=${page}&per_page=${perPage}`)
  .then((response) => {
    total = response.headers.get('X-WP-Total');
    return response.json();
  })
  .then((data) => {
    return {
      tab,
      data,
      total,
    };
  });
  res.json(result);
};

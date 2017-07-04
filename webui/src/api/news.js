export const fetchNewsProp = (tabName, page) => {
  let total = '';
  const myInit = {
    method: 'GET',
  };
  return fetch(`http://propholic.com/wp-json/wp/v2/${tabName}?page=${page}&per_page=9`, myInit)
  .then((res) => {
    total = res.headers.get('X-WP-Total');

    return res.json();
  })
  .then((data) => {
    let tab = '';
    if (tabName === 'prop-now') tab = 'propNow';
    else if (tabName === 'prop-talk') tab = 'propTalk';
    else if (tabName === 'prop-verdict') tab = 'propVerdict';

    const prop = {
      tab,
      data,
      total,
    };
    return prop;
  });
};

export const fetchNewsBanner = (tabName) => {
  const myInit = {
    method: 'GET',
  };
  return fetch(`http://propholic.com/wp-json/wp/v2/${tabName}?per_page=5`, myInit)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    const prop = {
      data,
    };
    return prop;
  });
};

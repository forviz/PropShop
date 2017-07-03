export const fetchNewsProp = (tabName, page) => {
  let total = '';
  const myInit = {
    method: 'GET',
  };
  return fetch(`http://propholic.com/wp-json/wp/v2/${tabName}?page=${page}`, myInit)
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

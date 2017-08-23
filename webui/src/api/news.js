const BASEURL = process.env.REACT_APP_MYAPI_URL;

export const fetchNewsProp = (tabName, page) => {
  const result = fetch(`${BASEURL}/news?tabName=${tabName}&page=${page}&perPage=9`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json());
  return result;
};

export const fetchNewsBanner = (tabName) => {
  const result = fetch(`${BASEURL}/news?tabName=${tabName}&page=1&perPage=5`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json());
  return result;
};

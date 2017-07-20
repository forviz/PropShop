import _ from 'lodash';

const BASEURL = 'http://localhost:4000/api/v1';

export const uploadMediaAPI = (file, fileName) => {
  const data = new FormData();
  data.append('file', file);
  return fetch(`${BASEURL}/media`, {
    method: 'POST',
    body: data,
  })
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    if (_.get(response, 'sys.id')) {
      return {
        status: 'success',
        data: response,
      };
    }
    return {
      status: 'fail',
    };
  });
};

export const deleteMediaAPI = (assetId) => {
  return fetch(`${BASEURL}/media/${assetId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    return response.json();
  })
  .then((response) => {
    if (_.get(response, 'sys.id')) {
      return {
        status: 'success',
        data: response,
      };
    }
    return {
      status: 'fail',
    };
  });
};

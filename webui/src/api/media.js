import _ from 'lodash';

const BASEURL = process.env.REACT_APP_BASE_URL;

export const uploadMediaAPI = async (file) => {
  const data = new FormData();
  data.append('file', file);
  const result = await fetch(`${BASEURL}/media`, {
    method: 'POST',
    body: data,
  })
  .then((response) => {
    return response.json();
  });
  return result;
};

export const deleteMediaAPI = async (assetId) => {
  const result = await fetch(`${BASEURL}/media/${assetId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then((response) => {
    return response.json();
  });
  return result;
};

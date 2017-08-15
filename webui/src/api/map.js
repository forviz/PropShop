import _ from 'lodash';

const BASEURL = process.env.REACT_APP_MYAPI_URL;

export const getNearbySearch = (lat, lng, radius, nearby) => {
  return fetch(`${BASEURL}/map/nearbysearch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lat, lng, radius, nearby }),
  })
  .then((response) => {
    return response.json();
  });
};

export const getDistances = (lat, lng, data) => {
  return fetch(`${BASEURL}/map/distancematrix`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lat, lng, data }),
  })
  .then((response) => {
    return response.json();
  });
};

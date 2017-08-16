import _ from 'lodash';
import mapAgentEntryToEntity from './utils/mapAgentEntryToEntity';

const BASEURL = process.env.REACT_APP_MYAPI_URL;

export const fetchUserAPI = (uid) => {
  return fetch(`${BASEURL}/user/${uid}`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json())
  .then((response) => {
    return mapAgentEntryToEntity(response.items[0]);
  });
};

export const updateUserAPI = (id, data) => {
  console.log('updateUserAPI', id, data);
  return fetch(`${BASEURL}/user/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
    }),
  })
  .then((response) => {
    return response.json();
  });
};

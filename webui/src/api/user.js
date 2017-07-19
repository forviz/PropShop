import _ from 'lodash';
import mapAgentEntryToEntity from './utils/mapAgentEntryToEntity';

const BASEURL = 'http://localhost:4000/api/v1';

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

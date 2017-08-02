const BASEURL = process.env.REACT_APP_MYAPI_URL;

export const sendEmailVerify = (entryId, username, email) => {
  return fetch(`${BASEURL}/email/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entryId,
      username,
      email,
    }),
  })
  .then(response => response.json())
  .then((response) => {
    console.log('SENDING', response);
    return response;
  });
};

export const emailVerifying = (entryId) => {
  return fetch(`${BASEURL}/user/${entryId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      verify: true,
    }),
  })
  .then(response => response.json())
  .then((response) => {
    console.log('VERIFIDYING', response);
    return response;
  });
};

const BASEURL = 'http://localhost:4000/api/v1';

export const sendEmailVerified = (username, email) => {
  return fetch(`${BASEURL}/email/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
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

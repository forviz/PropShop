const BASEURL = 'http://localhost:4000/api/v1';

export const createContactAgent = (name, emailFrom, emailTo, mobile, body, agentId) => {
  return fetch(`${BASEURL}/contact/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, emailFrom, emailTo, mobile, body, agentId }),
  })
  .then((response) => {
    return response.json();
  });
};

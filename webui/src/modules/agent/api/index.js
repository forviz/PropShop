const BASEURL = 'http://localhost:4000/api/v1';

export const createContactAgent = (name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyUrl, projectName) => {
  return fetch(`${BASEURL}/contact/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyUrl, projectName }),
  })
  .then((response) => {
    return response.json();
  });
};

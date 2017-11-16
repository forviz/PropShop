const BASEURL = process.env.REACT_APP_MYAPI_URL;

export const createContactAgent = (name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyId, projectName) => {
  return fetch(`${BASEURL}/contact/agent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyId, projectName }),
  })
  .then((response) => {
    return response.json();
  });
};

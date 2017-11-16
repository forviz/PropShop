const BASEURL = process.env.REACT_APP_MYAPI_URL;

const POLICY = process.env.REACT_APP_CONTENTFUL_POLICY;
const AGREEMENT = process.env.REACT_APP_CONTENTFUL_AGREEMENT;

export const fetchPolicyAPI = () => {
  const result = fetch(`${BASEURL}/content/${POLICY}`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json());
  return result;
};

export const fetchAgreementAPI = () => {
  const result = fetch(`${BASEURL}/content/${AGREEMENT}`, {
    'Content-Type': 'application/json',
  })
  .then(response => response.json());
  return result;
};

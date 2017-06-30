const BASEURL = 'http://localhost:4000/api/v1';

export const createPost = (data) => {
  return fetch(`${BASEURL}/posts`, {
    method: 'POST',
    body: JSON.stringify({
      ...data,
    }),
  })
  .then((response) => {
    console.log(response);
    return response;
  })
}

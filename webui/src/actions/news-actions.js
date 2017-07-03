import { fetchNewsProp } from '../api/news';

export const receiveNewsProp = (prop) => {
  return {
    type: 'NEWS/PROP/RECEIVED',
    prop,
  };
};

export const getNewsProp = (tab, page) => {
  console.log('GETNEWSPROP', tab, page);
  return (dispatch) => {
    fetchNewsProp(tab, page)
    .then((result) => {
      //if (result.status === 'ERROR') notification.error({ message: result.status, description: result.message });
      dispatch(receiveNewsProp(result));
    });
  };
};

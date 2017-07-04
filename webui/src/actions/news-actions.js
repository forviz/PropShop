import { fetchNewsProp, fetchNewsBanner } from '../api/news';

export const receiveNewsProp = (prop) => {
  return {
    type: 'NEWS/PROP/RECEIVED',
    prop,
  };
};

const fetchingNews = (fetching) => {
  return {
    type: 'NEWS/FETCHING',
    fetching,
  };
};

export const getNewsProp = (tab, page) => {
  return (dispatch) => {
    dispatch(fetchingNews(true));
    fetchNewsProp(tab, page)
    .then((result) => {
      //if (result.status === 'ERROR') notification.error({ message: result.status, description: result.message });
      dispatch(receiveNewsProp(result));
      dispatch(fetchingNews(false));
    });
  };
};

export const receiveNewsBanner = (prop) => {
  return {
    type: 'NEWS/BANNER/RECEIVED',
    prop,
  };
};

export const getNewsBanner = (tab) => {
  return (dispatch) => {
    fetchNewsBanner(tab)
    .then((result) => {
      //if (result.status === 'ERROR') notification.error({ message: result.status, description: result.message });
      dispatch(receiveNewsBanner(result));
    });
  };
};

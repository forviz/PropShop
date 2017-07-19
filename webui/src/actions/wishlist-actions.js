import { fetchGetWishlist, fetchCreateWishlist, fetchDeleteWishlist } from '../api/wishlist';

const fetching = (fetching) => {
  return {
    type: 'DOMAIN/WISHLIST/FETCHING',
    fetching,
  };
};

const fetchWishlistItems = (items) => {
  return {
    type: 'DOMAIN/WISHLIST/RESULT_RECEIVED',
    items,
  };
};

export const fetchWishlist = () => {
  return (dispatch) => {
    dispatch(fetching(true));
  };
};

export const getWishlist = (userId) => {
  return (dispatch) => {
    dispatch(fetching(true));
    fetchGetWishlist(userId)
    .then((items) => {
      dispatch(fetchWishlistItems(items));
      dispatch(fetching(false));
    });
  };
};

export const createWishlist = (userId, propertyId) => {
  return (dispatch) => {
    dispatch(fetching(true));

    fetchCreateWishlist(userId, propertyId)
    .then(() => {
      fetchGetWishlist(userId)
      .then((items) => {
        dispatch(fetchWishlistItems(items));
      });
    });
  };
};

export const deleteWishlist = (userId, entryId) => {
  console.log('USERSS',userId)
  return (dispatch) => {
    dispatch(fetching(true));

    fetchDeleteWishlist(entryId)
    .then(() => {
      fetchGetWishlist(userId)
      .then((items) => {
        dispatch(fetchWishlistItems(items));
      });
    });
  };
};


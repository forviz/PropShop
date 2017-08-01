import _ from 'lodash';
import { fetchGetWishlist, fetchCreateWishlist, fetchUpdateWishlist, fetchDeleteWishlist } from '../api/wishlist';

const fetching = (fetch) => {
  return {
    type: 'DOMAIN/WISHLIST/FETCHING',
    fetching: fetch,
  };
};

const wishlistItems = (items) => {
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
  return async (dispatch) => {
    dispatch(fetching(true));
    const items = await fetchGetWishlist(userId);
    await dispatch(wishlistItems(items));
    dispatch(fetching(false));
  };
};

export const createWishlist = (prevWishlist, userId, property) => {
  return async (dispatch) => {
    await dispatch(fetching(true));

    prevWishlist.push(property);
    dispatch(wishlistItems(prevWishlist));

    await fetchCreateWishlist(userId, property.id);
    await dispatch(fetching(false));
    // await dispatch(getWishlist(userId));
  };
};

export const updateWishlist = (guestId, userId) => {
  return async (dispatch) => {
    await dispatch(fetching(true));

    await fetchUpdateWishlist(guestId, userId);

    dispatch(fetching(false));
  };
};

export const deleteWishlist = (wishlist, userId, propertyId) => {
  return async (dispatch) => {
    await dispatch(fetching(true));

    _.pullAt(wishlist, _.findIndex(wishlist, ['id', propertyId]));
    dispatch(wishlistItems(wishlist));

    fetchDeleteWishlist(userId, propertyId);
    dispatch(fetching(false));
    // await dispatch(getWishlist(userId));
  };
};


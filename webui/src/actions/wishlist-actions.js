import _ from 'lodash';
import { fetchGetWishlist, fetchCreateWishlist, fetchUpdateWishlist, fetchDeleteWishlist, fetchUserWishlistAPI } from '../api/wishlist';

const doFetching = (fetch) => {
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
    dispatch(doFetching(true));
  };
};

export const getWishlist = (userId) => {
  return async (dispatch) => {
    dispatch(doFetching(true));
    const items = await fetchGetWishlist(userId);
    await dispatch(wishlistItems(items));
    dispatch(doFetching(false));
  };
};

export const createWishlist = (prevWishlist, userId, property) => {
  return async (dispatch) => {
    await dispatch(doFetching(true));
    prevWishlist.push(property);
    dispatch(wishlistItems(prevWishlist));

    await fetchCreateWishlist(userId, property.id);
    await dispatch(doFetching(false));
    // await dispatch(getWishlist(userId));
  };
};

export const updateWishlist = (guestId, userId) => {
  return async (dispatch) => {
    await dispatch(doFetching(true));

    await fetchUpdateWishlist(guestId, userId);

    dispatch(doFetching(false));
  };
};

export const deleteWishlist = (wishlist, userId, propertyId) => {
  return async (dispatch) => {
    await dispatch(doFetching(true));

    _.pullAt(wishlist, _.findIndex(wishlist, ['id', propertyId]));
    dispatch(wishlistItems(wishlist));

    fetchDeleteWishlist(userId, propertyId);
    dispatch(doFetching(false));
    // await dispatch(getWishlist(userId));
  };
};

const receiveWishlistProperty = (result) => {
  return {
    type: 'DOMAIN/ACCOUNT_WISHLIST/RESULT_RECEIVED',
    result,
  };
};

const fetchingWishlistProperty = (fetching) => {
  return {
    type: 'DOMAIN/ACCOUNT_WISHLIST/FETCHING',
    fetching,
  };
};

const fetchWishlistProperty = (fetch) => {
  return {
    type: 'DOMAIN/ACCOUNT_WISHLIST/FETCH',
    fetch,
  };
};

const totalWishlistProperty = (total) => {
  return {
    type: 'DOMAIN/ACCOUNT_WISHLIST/TOTAL',
    total,
  };
};

const pageWishlistProperty = (page) => {
  return {
    type: 'DOMAIN/ACCOUNT_WISHLIST/PAGE',
    page,
  };
};

export const fetchWishlistByAgent = (userId, skip, limit) => {
  return async (dispatch) => {
    dispatch(fetchWishlistProperty(false));
    dispatch(fetchingWishlistProperty(true));
    dispatch(receiveWishlistProperty({}));
    const result = await fetchUserWishlistAPI(userId, `?skip=${skip}&limit=${limit}`);
    dispatch(fetchWishlistProperty(true));
    dispatch(fetchingWishlistProperty(false));
    if (_.size(result.data) > 0) {
      dispatch(receiveWishlistProperty(result.data));
      dispatch(totalWishlistProperty(result.total));
      dispatch(pageWishlistProperty(skip + 1));
    }
  };
};

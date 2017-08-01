import React from 'react';
import { notification, Icon } from 'antd';

const BASEURL = process.env.REACT_APP_BASE_URL;

export const fetchGetWishlist = async (userId) => {
  return fetch(`${BASEURL}/wishlist/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then((response) => {
    console.log('Get Wishlist ', response);
    return response.data;
  });
};

export const fetchCreateWishlist = async (userId, propertyId) => {
  return fetch(`${BASEURL}/wishlist/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      propertyId,
    }),
  })
  .then(response => response.json())
  .then((response) => {
    console.log('CREATE ', response);

    notification.open({
      message: 'บันทึกเรียบร้อย',
      description: 'รายการที่บันทึกจะอยู่ในส่วนของผู้ใช้.',
      icon: <Icon type="heart" style={{ color: '#8ebc42' }} />,
    });
    return response.data;
  });
};

export const fetchUpdateWishlist = async (guestId, userId) => {
  return fetch(`${BASEURL}/wishlist/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guestId,
      userId,
    }),
  })
  .then(response => response.json())
  .then((response) => {
    console.log('UPDATE ', response);
    return response.data;
  });
};

export const fetchDeleteWishlist = async (userId, propertyId) => {
  return fetch(`${BASEURL}/wishlist/delete`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      propertyId,
    }),
  })
  .then(response => response.json())
  .then((response) => {
    console.log('DELETE', response);
    return response;
  });
};

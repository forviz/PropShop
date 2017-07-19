import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';
import moment from 'moment';

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
});

export const createWishlist = async (req, res, next) => {
  try {
    const data = req.body;
    console.log('data', data);

    res.json({
      status: 'SUCCESS',
      data: data
    })

  } catch (e) {
    next(e);
  }
};

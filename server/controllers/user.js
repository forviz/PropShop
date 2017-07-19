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

export const getUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const response = await client.getEntries({
      content_type: 'agent',
      'fields.uid': uid,
    });
    res.json(response);
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
}

export const updateUser = async (req, res, next) => {
   try {
    const data = req.body;
    const { uid } = req.params;

    const space = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE);
    const entry = await space.getEntry(uid);

    if (_.get(data, 'email')) entry.fields.email['en-US'] = data.email;
    if (_.get(data, 'prefixName')) entry.fields.prefixName['en-US'] = data.prefixName;
    if (_.get(data, 'name')) entry.fields.name['en-US'] = data.name;
    if (_.get(data, 'lastname')) entry.fields.lastname['en-US'] = data.lastname;
    if (_.get(data, 'phone')) entry.fields.phone['en-US'] = data.phone;
    if (_.get(data, 'rating')) entry.fields.rating['en-US'] = data.rating;
    if (_.get(data, 'company')) entry.fields.company['en-US'] = data.company;
    if (_.get(data, 'specialization')) entry.fields.specialization['en-US'] = data.specialization;
    if (_.get(data, 'licenseNumber')) entry.fields.licenseNumber['en-US'] = data.licenseNumber;
    if (_.get(data, 'about')) entry.fields.about['en-US'] = data.about;
    if (_.get(data, 'image')) entry.fields.image.sys.id['en-US'] = data.image;

    const entryUpdate = await entry.update();
    const entryPublish = await entryUpdate.publish();

    if (entryPublish.sys.id) {
      res.json({
        status: 'SUCCESS',
      });
    }

    res.json({
      status: 'FAIL',
    });
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};

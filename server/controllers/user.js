import * as contentful from 'contentful';
import * as contentfulManagement from 'contentful-management';
import _ from 'lodash';

const path = require('path');
const fs = require('fs');

const Mail = require('../libraries/email');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN,
});

const clientManagement = contentfulManagement.createClient({
  accessToken: process.env.CONTENTFUL_ACCESSTOKEN_MANAGEMENT,
});

const BASE_URL = process.env.BASE_URL;

export const getUser = async (req, res) => {
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
};

const existUser = (uid) => {
  return client.getEntries({
    content_type: 'agent',
    'fields.uid': uid,
  })
  .then((response) => {
    return response.total > 0 ? true : false;
  });
};

const sendEmailVerify = (id, username, email) => {
  try {
    fs.readFile(path.join(__dirname, '../views/email/template/user-verify', 'index.html'), 'utf8', (err, html) => {
      if (err) {
        throw err;
      }
      let htmlx = html;
      htmlx = htmlx.replace(/\%BASE_URL%/g, BASE_URL);
      htmlx = htmlx.replace('%USERNAME%', username);
      htmlx = htmlx.replace('%REDIRECT_URL%', `${BASE_URL}/#/login?verify=${id}`);

      const mail = new Mail({
        to: email,
        subject: 'Verify Email PropShop',
        html: htmlx,
        successCallback: () => {
        },
        errorCallback: () => {
        },
      });
      mail.send();
    });
  } catch (e) {
    console.log('error', e);
  }
};

export const createUser = async (req, res) => {
  try {
    const { data } = req.body;
    const hasUser = await existUser(data.uid);
    if (hasUser) {
      res.status(200).json({
        errors: {
          status: '409',
          title: 'Version Mismatch',
        },
      });
      return false;
    }
    const user = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.createEntry('agent', {
      fields: {
        username: {
          'en-US': data.username,
        },
        email: {
          'en-US': data.email,
        },
        phone: {
          'en-US': _.get(data, 'phoneNumber'),
        },
        uid: {
          'en-US': data.uid,
        },
        verify: {
          'en-US': data.verify,
        },
      },
    }))
    .then((entry) => {
      if (data.verify === false) sendEmailVerify(entry.sys.id, data.username, data.email);
      return entry.publish();
    });
    res.status(200).json({
      data: {
        user,
      },
    });
    return true;
  } catch (errors) {
    res.status(500).json({
      errors,
    });
    return false;
  }
};

export const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;

    const space = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE);
    const entry = await space.getEntry(id);

    if (_.get(data, 'email')) _.set(entry.fields, "email['en-US']", data.email);
    if (_.get(data, 'prefixName')) _.set(entry.fields, "prefixName['en-US']", data.prefixName);
    if (_.get(data, 'name')) _.set(entry.fields, "name['en-US']", data.name);
    if (_.get(data, 'lastname')) _.set(entry.fields, "lastname['en-US']", data.lastname);
    if (_.get(data, 'phone')) _.set(entry.fields, "phone['en-US']", data.phone);
    if (_.get(data, 'rating')) _.set(entry.fields, "rating['en-US']", data.rating);
    if (_.get(data, 'company')) _.set(entry.fields, "company['en-US']", data.company);
    if (_.get(data, 'specialization')) _.set(entry.fields, "specialization['en-US']", data.specialization);
    if (_.get(data, 'licenseNumber')) _.set(entry.fields, "licenseNumber['en-US']", data.licenseNumber);
    if (_.get(data, 'about')) _.set(entry.fields, "about['en-US']", data.about);
    if (_.get(data, 'verify')) _.set(entry.fields, "verify['en-US']", data.verify);
    if (_.get(data, 'image.sys.id')) {
      _.set(entry.fields, "image['en-US'].sys.type", 'Link');
      _.set(entry.fields, "image['en-US'].sys.linkType", 'Asset');
      _.set(entry.fields, "image['en-US'].sys.id", data.image.sys.id);
    }

    const entryUpdate = await entry.update();
    const entryPublish = await entryUpdate.publish();

    if (entryPublish.sys.id) {
      res.json({
        status: 'SUCCESS',
      });
    } else {
      res.json({
        status: 'FAIL',
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 'ERROR',
      message: e.message,
    });
  }
};

export const contactAgent = async (req, res, next) => {
  try {
    const { name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyId, projectName } = req.body;

    const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    .then(space => space.createEntry('contact', {
      fields: {
        contactName: {
          'en-US': name,
        },
        contactEmail: {
          'en-US': emailFrom,
        },
        contactMobile: {
          'en-US': mobile,
        },
        body: {
          'en-US': body,
        },
        recepient: {
          'en-US': {
            sys: {
              id: agentId,
              linkType: 'Entry',
              type: 'Link',
            },
          },
        },
        sendEmailStatus: {
          'en-US': false,
        },
      },
    }))
    .then((entry) => {
      return entry.publish();
    });

    if (!_.get(response, 'sys.id')) {
      res.status(500).json({
        status: '500',
        code: 'Internal Server Error',
      });
    }

    const contactId = response.sys.id;

    fs.readFile(path.join(__dirname, '../views/email/template/contact-agent', 'index.html'), 'utf8', (err, html) => {
      if (err) {
        throw err;
      }

      const sendFrom = name ? name : emailFrom;
      let htmlx = html;
      htmlx = htmlx.replace(/\%BASE_URL%/g, BASE_URL);
      htmlx = htmlx.replace('%SEND_FROM%', sendFrom);
      htmlx = htmlx.replace(/\%PROPERTY_URL%/g, `${BASE_URL}/#/property/${propertyId}`);
      htmlx = htmlx.replace('%PROJECT%', projectName);
      htmlx = htmlx.replace('%OWNER%', agentName);
      htmlx = htmlx.replace('%MESSAGE%', body);

      const mail = new Mail({
        to: emailFrom,
        subject: `${sendFrom}, thank you for your enquiry`,
        html: htmlx,
        successCallback: () => {
        },
        errorCallback: () => {
        },
      });
      mail.send();
    });

    fs.readFile(path.join(__dirname, '../views/email/template/agent-receive', 'index.html'), 'utf8', (err, html) => {
      if (err) {
        throw err;
      }

      const sendFrom = name ? name : emailFrom;
      let htmlx = html;
      htmlx = htmlx.replace(/\%BASE_URL%/g, BASE_URL);
      htmlx = htmlx.replace('%OWNER%', agentName);
      htmlx = htmlx.replace('%PROJECT%', projectName);
      htmlx = htmlx.replace('%MESSAGE%', body);
      htmlx = htmlx.replace(/\%CONTACT_NAME%/g, sendFrom);
      htmlx = htmlx.replace('%CONTACT_EMAIL%', emailFrom);
      htmlx = htmlx.replace('%CONTACT_PHONE%', mobile);
      htmlx = htmlx.replace('%CONTACT_URL%', `${BASE_URL}/#/account/contact`);
      htmlx = htmlx.replace(/\%PROPERTY_URL%/g, `${BASE_URL}/#/property/${propertyId}`);

      const mail = new Mail({
        to: emailTo,
        subject: `${sendFrom} has left you the following message about your property`,
        html: htmlx,
        successCallback: () => {
          clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
          .then(space => space.getEntry(contactId))
          .then((entry) => {
            entry.fields.sendEmailStatus['en-US'] = true;
            return entry.update();
          });
          res.json({
            status: 'success',
          });
          return false;
        },
        errorCallback: () => {
          res.json({
            status: 'success',
          });
          return false;
        },
      });
      mail.send();
    });
  } catch (e) {
    res.status(500).json({
      status: '500',
      code: 'Internal Server Error',
      title: e.message,
    });
  }
};

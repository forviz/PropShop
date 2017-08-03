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

export const contactAgent = async (req, res, next) => {
  try {
    const { name, emailFrom, emailTo, mobile, body, agentId, agentName, propertyUrl, projectName } = req.body;

    // const response = await clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
    // .then((space) => space.createEntry('contact', {
    //   fields: {
    //     contactName: {
    //       'en-US': name,
    //     },
    //     contactEmail: {
    //       'en-US': emailFrom,
    //     },
    //     contactMobile: {
    //       'en-US': mobile,
    //     },
    //     body: {
    //       'en-US': body,
    //     },
    //     recepient: {
    //       'en-US': {
    //         sys: {
    //           id: agentId,
    //           linkType: 'Entry',
    //           type: 'Link',
    //         },
    //       },
    //     },
    //     sendEmailStatus: {
    //       'en-US': false,
    //     },
    //   },
    // }))
    // .then((entry) => {
    //   return entry.publish();
    // });

    // if (!_.get(response, 'sys.id')) {
    //   res.status(500).json({
    //     status: '500',
    //     code: 'Internal Server Error',
    //   });
    // }

    // const contactId = response.sys.id;

    const imagesDir = path.join(__dirname, 'views/email/images');

    fs.readFile(path.join(__dirname, '../views/email/template/contact-agent', 'index.html'), 'utf8', function (err, html) {
      if (err) {
        throw err; 
      }

      const sendFrom = name ? name : emailFrom;

      html = html.replace(/\%BASE_IMAGES_URL%/g, imagesDir);
      html = html.replace("%SEND_FROM%", sendFrom);
      html = html.replace("%PROPERTY_URL%", propertyUrl);
      html = html.replace("%PROJECT%", projectName);
      html = html.replace("%OWNER%", agentName);
      html = html.replace("%MESSAGE%", body);

      // res.json({
      //   html,
      // });

      // return false;

      const mail = new Mail({
        from: emailFrom,
        to: emailTo,
        subject: 'ติดต่อ Agent',
        html,
        successCallback: function(suc) {

          const updateSendEmailStatus = clientManagement.getSpace(process.env.CONTENTFUL_SPACE)
          .then((space) => space.getEntry(contactId))
          .then((entry) => {
            entry.fields.sendEmailStatus['en-US'] = true;
            return entry.update();
          });

          res.json({
            status: 'success',
          });

        },
        errorCallback: function(err) {
          res.json({
            status: 'success',
          });
        }
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
}

const fetch = require('node-fetch');

const url = require('url');
const path = require('path');
const fs = require('fs');

export const getImageName = (imageUrl) => {
  const parsed = url.parse(imageUrl);
  return path.basename(parsed.pathname);
};

export const getImageType = (imageUrl) => {
  return fetch(imageUrl).then(response => response.headers.get('Content-Type'));
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const logs = (file, data) => {
  fs.appendFile(path.resolve(__dirname, `../logs/${file}`), JSON.stringify(data, null, 2), (error) => {
    if (error) {
      console.log('error', error);
    }
    console.log('The file was saved!');
  });
};

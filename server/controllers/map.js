const fetch = require('node-fetch');

const KEY = process.env.GOOGLE_APIKEY;

export const getNearbySearch = async (req, res) => {
  const { lat, lng, radius, nearby } = req.body;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${nearby}&key=${KEY}`;
  const result = await fetch(url)
  .then((response) => {
    return response.json();
  });
  res.json({
    data: result,
  });
};

export const getDistance = async (lat, lng, desLat, desLng) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?key=${KEY}&origins=${lat},${lng}&destinations=${desLat},${desLng}`;
  const result = await fetch(url)
  .then((response) => {
    return response.json();
  });
  return result;
};

export const getDistances = async (req, res) => {
  const { lat, lng, data } = req.body;
  const newData = await Promise.all(data.map(async (value) => {
    const distance = await getDistance(lat, lng, value.geometry.location.lat, value.geometry.location.lng);
    return {
      ...value,
      distance: distance.rows[0].elements[0].distance.text,
    };
  }));
  res.json({
    data: newData,
  });
};

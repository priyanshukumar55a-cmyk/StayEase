const axios = require("axios");

const getCoordinates = async (address) => {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1
      },
      headers: {
        'User-Agent': 'StayEase/1.0 (priyanshukumar55a@gmail.com)'
      }
    });

    if (!res.data || res.data.length === 0) {
      console.log(`Geocoding failed for "${address}": No results found`);
      return {
        lat: 28.6139,
        lng: 77.2090
      };
    }

    const location = res.data[0];
    return {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon)
    };
  } catch (err) {
    console.error('Geocoding request error:', err.message);
    return {
      lat: 28.6139,
      lng: 77.2090
    };
  }
};

module.exports = getCoordinates;
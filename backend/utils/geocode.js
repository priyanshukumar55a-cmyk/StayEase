const axios = require('axios');

const getCoordinates = async (address) => {
    try {
        const token = process.env.LOCATIONIQ_TOKEN;

        const response = await axios.get(
            'https://us1.locationiq.com/v1/search',
            {
                params: {
                    key: token,
                    q: address,
                    format: 'json',
                    limit: 1
                }
            }
        );

        const data = response.data;

        if (!data || data.length === 0) {
            throw new Error('No location found');
        }

        return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
        };

    } catch (err) {
        console.error("LocationIQ Error:", err.response?.data || err.message);
        throw new Error("Geocoding failed");
    }
};

module.exports = getCoordinates;
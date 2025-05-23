const NodeGeocoder = require('node-geocoder');

let geocoder;

// Only initialize geocoder if API key is provided
if (process.env.GEOCODER_API_KEY) {
  const options = {
    provider: process.env.GEOCODER_PROVIDER || 'mapquest',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
  };
  
  geocoder = NodeGeocoder(options);
} else {
  console.warn('GEOCODER_API_KEY not provided. Location-based features will be limited.');
  
  // Create a mock geocoder for development
  geocoder = {
    async geocode() {
      // Return default coordinates (San Francisco)
      return [{
        latitude: 37.7749,
        longitude: -122.4194,
        formattedAddress: 'San Francisco, CA, USA',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        countryCode: 'US'
      }];
    }
  };
}

module.exports = geocoder;

// Returns public Square config (non-secret) to the frontend
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    appId:       process.env.SQUARE_APP_ID       || '',
    locationId:  process.env.SQUARE_LOCATION_ID  || '',
    environment: process.env.SQUARE_ENVIRONMENT  || 'sandbox',
  });
};

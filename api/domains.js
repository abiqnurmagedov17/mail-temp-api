const { getDomains } = require('./lib/temp-mail');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=150');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const domains = await getDomains();
    res.status(200).json({
      success: true,
      domains,
      count: domains.length
    });
  } catch (error) {
    console.error('API domains error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
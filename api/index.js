module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    res.status(200).json({
      name: 'Temp Mail API Proxy',
      version: '1.0.0',
      status: 'running',
      endpoints: {
        'GET    /api': 'Info (this page)',
        'GET    /api/domains': 'Get available domains',
        'POST   /api/email': 'Create new email (body: {name?, domain?})',
        'GET    /api/messages?email=xxx@domain.com': 'Get messages for email',
        'DELETE /api/delete?email=xxx@domain.com': 'Delete email'
      },
      examples: {
        create_custom: 'POST /api/email -d \'{"name":"john","domain":"lnovic.com"}\'',
        create_random: 'POST /api/email -d \'{}\'',
        get_messages: 'GET /api/messages?email=john@lnovic.com',
        delete_email: 'DELETE /api/delete?email=john@lnovic.com'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
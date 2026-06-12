const { getMessages } = require('./lib/temp-mail');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Use GET method' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Parameter "email" wajib diisi'
    });
  }

  try {
    const result = await getMessages(email);
    res.status(200).json(result);
  } catch (error) {
    console.error('API messages error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
const { deleteEmail } = require('./lib/temp-mail');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Use DELETE method' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Parameter "email" wajib diisi'
    });
  }

  try {
    const result = await deleteEmail(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
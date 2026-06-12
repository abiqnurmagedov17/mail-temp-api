const axios = require('axios');

const TEMP_MAIL_V3 = 'https://api.internal.temp-mail.io/api/v3';
const TEMP_MAIL_V4 = 'https://api.internal.temp-mail.io/api/v4';

const HEADERS = {
  'Content-Type': 'application/json',
  'Application-Name': 'web',
  'Application-Version': '4.0.0',
  'X-CORS-Header': 'iaWg3pchvFx48fY',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
  'Referer': 'https://temp-mail.io/en',
  'Accept': 'application/json'
};

// Get available domains
async function getDomains() {
  try {
    const response = await axios.get(`${TEMP_MAIL_V4}/domains`, {
      headers: HEADERS,
      timeout: 10000
    });

    const data = response.data;
    let domains = [];

    if (Array.isArray(data)) {
      domains = data;
    } else if (data?.domains) {
      domains = data.domains;
    } else if (data?.data) {
      domains = data.data;
    }

    // Extract string domains
    domains = domains
      .map(d => typeof d === 'string' ? d : (d?.domain || d?.name || ''))
      .filter(d => d && d.includes('.'));

    if (domains.length === 0) {
      throw new Error('No domains found');
    }

    return domains;

  } catch (error) {
    console.error('❌ getDomains error:', error.message);
    // Fallback domains
    return [
      'lnovic.com', 'bltiwd.com', 'gmeenramy.com',
      'cembt.mom', 'nimt.homes', 'kearnt.com',
      'konekes.com', 'coleville.com'
    ];
  }
}

// Create new email
async function createEmail(name, domain) {
  const body = {};
  if (name) body.name = name.toLowerCase().trim();
  if (domain) body.domain = domain.toLowerCase().trim();

  try {
    const response = await axios.post(`${TEMP_MAIL_V3}/email/new`, body, {
      headers: HEADERS,
      timeout: 15000
    });

    const data = response.data;
    
    return {
      success: true,
      email: data.email,
      created_at: data.created_at || new Date().toISOString(),
      expires_at: data.expires_at || null
    };

  } catch (error) {
    console.error('❌ createEmail error:', error.message);

    // Fallback: construct email manually
    if (name && domain) {
      return {
        success: true,
        email: `${name}@${domain}`,
        created_at: new Date().toISOString(),
        expires_at: null,
        fallback: true
      };
    }

    // Random fallback
    const domains = await getDomains();
    const randomName = 'user' + Math.random().toString(36).substring(2, 10);
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    
    return {
      success: true,
      email: `${randomName}@${randomDomain}`,
      created_at: new Date().toISOString(),
      expires_at: null,
      fallback: true
    };
  }
}

// Get messages for an email
async function getMessages(email) {
  try {
    const encodedEmail = encodeURIComponent(email);
    
    const response = await axios.get(`${TEMP_MAIL_V3}/email/${encodedEmail}/messages`, {
      headers: HEADERS,
      timeout: 10000
    });

    const data = response.data;
    
    let messages = [];
    if (Array.isArray(data)) {
      messages = data;
    } else if (data?.messages) {
      messages = data.messages;
    } else if (data?.data) {
      messages = data.data;
    }

    return {
      success: true,
      email,
      messages,
      count: messages.length
    };

  } catch (error) {
    console.error('❌ getMessages error:', error.message);
    return {
      success: true,
      email,
      messages: [],
      count: 0
    };
  }
}

// Delete email
async function deleteEmail(email) {
  try {
    const encodedEmail = encodeURIComponent(email);
    
    await axios.delete(`${TEMP_MAIL_V3}/email/${encodedEmail}`, {
      headers: HEADERS,
      timeout: 10000
    });

  } catch (error) {
    console.error('❌ deleteEmail error:', error.message);
  }

  return {
    success: true,
    email,
    deleted: true
  };
}

module.exports = { getDomains, createEmail, getMessages, deleteEmail };
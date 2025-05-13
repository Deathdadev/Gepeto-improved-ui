const express = require('express');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');
const crypto = require('crypto');
const FileStore = require('session-file-store')(session);
const path = require('path');
require('dotenv').config({ path: '../.env' });

// Helper function for Base64 URL encoding
function base64URLEncode(str) {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Helper function to SHA256 hash
function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest();
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Use memory store for sessions in serverless environment
const MemoryStore = require('memorystore')(session);

app.use(session({
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 300000,
    sameSite: 'Lax'
  }
}));

// Endpoint to initiate GitHub OAuth flow with PKCE
app.get('/api/auth/github', (req, res) => {
  const redirectUri = `${process.env.FRONTEND_URL}/oauth/callback`;
  const scope = 'read:user user:email';
  const state = crypto.randomBytes(16).toString('hex');
  const code_verifier = base64URLEncode(crypto.randomBytes(32));
  const code_challenge = base64URLEncode(sha256(code_verifier));

  req.session.oauth_state = state;
  req.session.code_verifier = code_verifier;
  req.session.now = Date.now();

  const authUrlParams = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: scope,
    state: state,
    code_challenge: code_challenge,
    code_challenge_method: 'S256'
  });

  const authUrl = `https://github.com/login/oauth/authorize?${authUrlParams.toString()}`;
  res.redirect(authUrl);
});

// Endpoint to exchange GitHub OAuth code for an access token using PKCE
app.post('/api/auth/github/exchange-code', async (req, res) => {
  const { code, state } = req.body;

  if (!state || state !== req.session.oauth_state) {
    req.session.oauth_state = null;
    req.session.code_verifier = null;
    return res.status(400).json({ success: false, message: 'Invalid state parameter.' });
  }

  const code_verifier = req.session.code_verifier;
  req.session.oauth_state = null;
  req.session.code_verifier = null;

  if (!code) {
    return res.status(400).json({ success: false, message: 'Authorization code is missing.' });
  }

  if (!code_verifier) {
    return res.status(400).json({ success: false, message: 'Session expired or invalid.' });
  }

  const redirectUri = `${process.env.FRONTEND_URL}/oauth/callback`;

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        code_verifier: code_verifier,
        redirect_uri: redirectUri
      },
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    const { access_token, error, error_description } = tokenResponse.data;

    if (error || !access_token) {
      console.error('GitHub token exchange error:', error, error_description);
      return res.status(400).json({ success: false, message: `Failed to exchange code: ${error_description || error || 'Unknown error'}` });
    }

    let githubUserData = null;
    try {
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      githubUserData = {
        login: userResponse.data.login,
        id: userResponse.data.id,
        avatar_url: userResponse.data.avatar_url,
        name: userResponse.data.name
      };
    } catch (userError) {
      console.error('Failed to fetch GitHub user info:', userError.response?.data || userError.message);
    }

    res.json({
      success: true,
      token: access_token,
      user: githubUserData
    });

  } catch (error) {
    console.error('Error during GitHub OAuth code exchange:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Internal server error during code exchange.' });
  }
});

// Export the Express API
module.exports = app;

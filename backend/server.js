const express = require('express');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session'); // Add express-session
const crypto = require('crypto'); // Add crypto for state generation and PKCE
const FileStore = require('session-file-store')(session); // Added for persistent sessions
const path = require('path'); // Added for path.join
// Load environment variables from the root .env file (still needed for SESSION_SECRET, FRONTEND_URL etc.)
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
const PORT = process.env.BACKEND_PORT || 3000; // Use BACKEND_PORT from .env or default to 3000

// Hardcoded GitHub Client ID for the app
const GITHUB_CLIENT_ID = 'your-client-id-here'; // Replace this with your actual GitHub OAuth App client ID

// Enable CORS for the frontend running on port 8080 (or configured FRONTEND_URL's origin)
// Extract origin from FRONTEND_URL for CORS
let frontendOrigin = 'http://localhost:8080'; // Default if not set
if (process.env.FRONTEND_URL) {
  try {
    const url = new URL(process.env.FRONTEND_URL);
    frontendOrigin = url.origin;
  } catch (e) {
    console.warn(`Invalid FRONTEND_URL format: ${process.env.FRONTEND_URL}. Defaulting CORS origin to ${frontendOrigin}`);
  }
}
console.log(`[CORS] Configured frontendOrigin: ${frontendOrigin}`); // Logging frontendOrigin

const corsOptions = {
  origin: frontendOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Session middleware configuration
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret || sessionSecret === 'fallback-secret-please-change') {
  console.error("ERROR: SESSION_SECRET is not set or is insecure in the .env file. Please generate a strong secret.");
  process.exit(1); // Exit if the session secret is insecure/missing
}

const fileStoreOptions = {
  path: path.join(__dirname, '.sessions'),
  logFn: function(msg) { console.log('[SessionFileStore]', msg); }, // RESTORED THIS
  reapInterval: -1 // RESTORED THIS
};
console.log('[DEBUG] FileStore options:', fileStoreOptions); 
const sessionFileStoreInstance = new FileStore(fileStoreOptions);
console.log('[DEBUG] sessionFileStore instance:', sessionFileStoreInstance); 

app.use(session({
  store: sessionFileStoreInstance, 
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false, 
  cookie: {
    httpOnly: true,
    maxAge: 300000,
    sameSite: 'Lax' 
  }
}));


// Endpoint to initiate GitHub OAuth flow with PKCE
app.get('/api/auth/github', (req, res) => {
  console.log('[AUTH_INIT] /api/auth/github route hit.'); // LOG 1
  const redirectUri = `${process.env.FRONTEND_URL}/oauth/callback`;
  console.log('[AUTH_INIT] redirectUri:', redirectUri); // LOG 2
  const scope = 'read:user user:email';
  const state = crypto.randomBytes(16).toString('hex');
  console.log('[AUTH_INIT] Generated state:', state); // LOG 3

  const code_verifier = base64URLEncode(crypto.randomBytes(32));
  const code_challenge = base64URLEncode(sha256(code_verifier));
  console.log('[AUTH_INIT] Generated code_verifier (first 10 chars):', code_verifier.substring(0,10)); // LOG 4
  
  if (!process.env.FRONTEND_URL) {
      console.error('[AUTH_INIT_ERROR] Frontend URL not configured in .env');
      return res.status(500).send('Server configuration error: Frontend URL missing.');
  }
  console.log('[AUTH_INIT] FRONTEND_URL check passed.'); // LOG 5

  req.session.oauth_state = state;
  req.session.code_verifier = code_verifier; 
  req.session.now = Date.now(); 
  console.log('[AUTH_INIT] Session properties assigned. oauth_state:', req.session.oauth_state, 'code_verifier (first 10):', req.session.code_verifier ? req.session.code_verifier.substring(0,10) : 'undefined'); // LOG 6

  console.log('[PRE-SAVE] Attempting to save session. ID:', req.sessionID); 
  console.log('[PRE-SAVE] Session object before save:', JSON.stringify(req.session, null, 2)); 
  
  req.session.save((err) => {
    if (err) {
      console.error('[SAVE ERROR] Session save error before redirect:', err); 
      return res.status(500).send('Server error during session save.');
    }
    console.log('[SAVE SUCCESS] Session saved before redirect. Session ID:', req.sessionID); 
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
});

// Configuration for the production auth server
const PRODUCTION_AUTH_SERVER = 'https://your-deployed-server.com'; // You'll need to replace this with your actual deployed server URL

// Endpoint to exchange GitHub OAuth code for an access token using PKCE
app.post('/api/auth/github/exchange-code', async (req, res) => {
  const { code, state } = req.body;

  console.log('--- Exchange Code Request ---');
  console.log('Received Body:', req.body);
  console.log('Session oauth_state:', req.session.oauth_state);
  console.log('Session code_verifier:', req.session.code_verifier);
  console.log('---');

  if (!state || state !== req.session.oauth_state) {
    console.error('Invalid state parameter during code exchange. Frontend sent:', state, 'Backend expected:', req.session.oauth_state);
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
    console.error('Code verifier missing from session during code exchange.');
    return res.status(400).json({ success: false, message: 'Session expired or invalid.' });
  }

  const redirectUri = `${process.env.FRONTEND_URL}/oauth/callback`;
  if (!process.env.FRONTEND_URL) {
    console.error('Frontend URL not configured in .env during token exchange.');
    return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }
  try {
    // Instead of directly exchanging with GitHub, forward to production server
    const tokenResponse = await axios.post(
      `${PRODUCTION_AUTH_SERVER}/api/auth/github/exchange-code`,
      {
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
    if (error.response) {
      console.error('Error during GitHub OAuth code exchange:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Error during GitHub OAuth code exchange: No response received', error.request);
    } else {
      console.error('Error during GitHub OAuth code exchange:', error.message);
    }
    res.status(500).json({ success: false, message: 'Internal server error during code exchange.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
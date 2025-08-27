// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db.js'); // pastikan db.js meng-export client/pool PG yang benar
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this_secret';
const COOKIE_NAME = 'sso_token';
const TOKEN_EXP = '2h'; // lifetime token

// CORS - jika frontend dev server berbeda origin, set FRONTEND_ORIGIN env
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

// body parser
app.use(express.json());

// ---------------------- Helper ----------------------
function parseCookies(cookieHeader = '') {
  // simple cookie parser (returns object)
  return cookieHeader.split(';').map(c => c.trim()).reduce((acc, cur) => {
    if (!cur) return acc;
    const idx = cur.indexOf('=');
    if (idx === -1) return acc;
    const key = cur.substring(0, idx).trim();
    const val = decodeURIComponent(cur.substring(idx + 1).trim());
    acc[key] = val;
    return acc;
  }, {});
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXP });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

// Optional middleware to protect api routes (example)
function requireAuth(req, res, next) {
  try {
    const cookies = parseCookies(req.headers.cookie || '');
    const token = cookies[COOKIE_NAME];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

// ---------------------- Routes ----------------------

// Simple health
app.get('/health', (req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// 1) Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // cek apakah user sudah ada
    const userCheck = await pool.query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashed]
    );

    const user = result.rows[0];

    return res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 2) Login -> set cookie sso_token
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier bisa username atau email

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    const q = 'SELECT id, username, email, password FROM users WHERE username = $1 OR email = $1 LIMIT 1';
    const result = await pool.query(q, [identifier]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // sign token
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    const token = signToken(payload);

    // set cookie httpOnly
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true di production (HTTPS)
      sameSite: 'Lax', // adjust jika perlu 'None' + secure true untuk cross-site
      maxAge: 2 * 60 * 60 * 1000, // 2 jam dalam ms
    };

    res.cookie(COOKIE_NAME, token, cookieOptions);

    // return safe user info
    return res.json({
      message: 'Login berhasil',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// 3) Logout -> clear cookie
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  return res.json({ message: 'Logged out' });
});

// 4) Auth endpoint for NGINX auth_request -> /auth/seafile
// Nginx will call this as an internal subrequest. If returned 2xx, Nginx will continue.
// We also set header X-Remote-User in the response so nginx can forward it to Seafile.
app.get('/auth/seafile', async (req, res) => {
  try {
    const cookies = parseCookies(req.headers.cookie || '');
    const token = cookies[COOKIE_NAME];
    if (!token) {
      // return 401 so nginx will block
      return res.status(401).send('Unauthorized');
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      return res.status(401).send('Unauthorized');
    }

    // Optional: cek apakah user ada di DB dan aktif
    // const dbCheck = await pool.query('SELECT id, username FROM users WHERE id = $1 LIMIT 1', [payload.id]);
    // if (dbCheck.rows.length === 0) return res.status(401).send('Unauthorized');

    // set header that nginx will read as $upstream_http_x_remote_user
    // IMPORTANT: Nginx will map this to REMOTE_USER header sent to Seafile.
    res.set('X-Remote-User', payload.username);
    return res.status(200).send('OK');
  } catch (err) {
    console.error('/auth/seafile error', err);
    return res.status(500).send('Error');
  }
});

// Example protected route
app.get('/api/me', requireAuth, (req, res) => {
  return res.json({ user: req.user });
});

// ---------------- Serve Frontend (existing) ----------------
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));
// Catch-all handler for SPA (non-API)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// ---------------- Start ----------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

const express = require('express');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Headers Discord Activity ──────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.removeHeader('X-Frame-Options');
  // frame-ancestors : autoriser Discord à intégrer la page
  res.setHeader('Content-Security-Policy',
    "frame-ancestors https://discord.com https://*.discord.com https://*.discordsays.com"
  );
  if(req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(express.static(__dirname));

// ── CLIENT_ID (pas secret) ────────────────────────────────────────────────
app.get('/api/client-id', (_, res) => {
  res.json({ client_id: process.env.DISCORD_CLIENT_ID || '' });
});

// ── Token exchange — accessible via /api/token ET /.proxy/api/token ───────
async function handleTokenExchange(req, res) {
  const { code } = req.body;
  if(!code) return res.status(400).json({ error: 'code manquant' });

  try{
    const r = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type:    'authorization_code',
        code,
      }),
    });
    const data = await r.json();
    if(data.error) return res.status(400).json({ error: data.error });
    res.json({ access_token: data.access_token });
  }catch(err){
    console.error('Token error:', err.message);
    res.status(500).json({ error: 'token exchange failed' });
  }
}

// Discord appelle via /.proxy/api/token dans l'iframe
app.post('/.proxy/api/token', handleTokenExchange);
// Fallback pour les tests en navigateur direct
app.post('/api/token', handleTokenExchange);

// ── Health ────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({
  ok: true,
  discord: !!process.env.DISCORD_CLIENT_ID
}));

// ── SPA fallback ──────────────────────────────────────────────────────────
app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => {
  console.log(`🎮 Impostor League — port ${PORT}`);
  console.log(`   Discord CLIENT_ID: ${process.env.DISCORD_CLIENT_ID ? '✅' : '❌ manquant'}`);
});

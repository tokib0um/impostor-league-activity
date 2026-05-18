const express = require('express');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── CORS + headers Discord Activity ─────────────────────────────────────
app.use((req, res, next) => {
  // Discord nécessite ces headers pour les iframes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Content Security Policy pour Discord Activity
  res.setHeader('Content-Security-Policy', [
    "default-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "https://*.discordsays.com",
    "https://*.discordapp.com", 
    "https://discord.com",
    "https://*.googleapis.com",
    "https://*.gstatic.com",
    "https://*.firebasedatabase.app",
    "wss://*.firebasedatabase.app",
    "frame-ancestors https://discord.com https://*.discord.com"
  ].join('; '));

  // Permettre l'embedding dans Discord
  res.removeHeader('X-Frame-Options');
  
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// ── Servir les fichiers statiques ─────────────────────────────────────────
app.use(express.static(__dirname));

// ── Exposer CLIENT_ID au frontend (pas secret) ────────────────────────────
app.get('/api/client-id', (_, res) => {
  res.json({ client_id: process.env.DISCORD_CLIENT_ID || '' });
});

// ── Discord OAuth token exchange ──────────────────────────────────────────
app.post('/api/token', async (req, res) => {
  const { code } = req.body;
  if(!code) return res.status(400).json({ error: 'No code provided' });

  try{
    const response = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id:     process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type:    'authorization_code',
        code,
      }),
    });

    const data = await response.json();
    if(data.error){
      console.error('Discord token error:', data);
      return res.status(400).json({ error: data.error });
    }
    res.json({ access_token: data.access_token });

  }catch(err){
    console.error('Token exchange error:', err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// ── Health ────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({
    status: 'ok',
    game: 'Impostor League',
    discord_configured: !!process.env.DISCORD_CLIENT_ID
  });
});

// ── SPA fallback ──────────────────────────────────────────────────────────
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎮 Impostor League — port ${PORT}`);
  console.log(`   Discord: ${process.env.DISCORD_CLIENT_ID ? '✅ configuré' : '❌ CLIENT_ID manquant'}`);
});

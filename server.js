const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ── Serve static files (le jeu) ───────────────────────────────────────────
app.use(express.static(__dirname));

// ── Expose CLIENT_ID au frontend (pas secret) ─────────────────────────────
app.get('/api/client-id', (_, res) => {
  res.json({ client_id: process.env.DISCORD_CLIENT_ID || '' });
});

// ── Discord OAuth token exchange ──────────────────────────────────────────
// Le CLIENT_SECRET ne doit JAMAIS aller côté frontend
app.post('/api/token', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
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
    if (data.error) {
      console.error('Discord token error:', data);
      return res.status(400).json({ error: data.error });
    }
    // On renvoie UNIQUEMENT l'access_token, jamais le client_secret
    res.json({ access_token: data.access_token });

  } catch (err) {
    console.error('Token exchange error:', err);
    res.status(500).json({ error: 'Token exchange failed' });
  }
});

// ── Health check ──────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    game: 'Impostor League',
    discord_configured: !!process.env.DISCORD_CLIENT_ID
  });
});

// ── Fallback → SPA ────────────────────────────────────────────────────────
app.get('*', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎮 Impostor League actif sur le port ${PORT}`);
  console.log(`   Discord configuré: ${!!process.env.DISCORD_CLIENT_ID}`);
});

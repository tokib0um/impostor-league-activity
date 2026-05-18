# 🎮 IMPOSTOR LEAGUE — Discord Activity Setup Guide

## Vue d'ensemble

Tu vas créer une vraie Discord Activity en 4 étapes :
1. Créer l'app Discord (5 min)
2. Déployer sur Railway (10 min)
3. Configurer Discord avec l'URL Railway (2 min)
4. Tester avec tes amis

---

## ÉTAPE 1 — Créer l'application Discord

### 1.1 Créer l'app
1. Va sur https://discord.com/developers/applications
2. Clique **"New Application"**
3. Nom : **Impostor League**
4. Clique **"Create"**

### 1.2 Récupérer tes clés
Dans ton application Discord :
- Va dans **"OAuth2"** → **"General"**
- Copie le **Client ID** (tu en auras besoin plus tard)
- Clique **"Reset Secret"** → copie le **Client Secret** (garde-le secret !)

### 1.3 Activer Activities
1. Dans le menu gauche → **"Activities"**
2. Active le toggle **"Enable Activities"**
3. **URL Mapping** → tu reviendras ici après Railway

### 1.4 Configurer OAuth2
1. Dans **"OAuth2"** → **"Redirects"**
2. Ajoute : `https://TON-APP.railway.app/` (tu rempliras après)

---

## ÉTAPE 2 — Déployer sur Railway

### 2.1 Créer le repo GitHub
1. Va sur https://github.com → **New repository**
2. Nom : `impostor-league-activity`
3. **Public** → Create

### 2.2 Upload les fichiers
Dans GitHub, upload ces fichiers (tous dans le même dossier) :
- `server.js`
- `package.json`
- `.gitignore`
- Le dossier `public/` avec `index.html` dedans

**Structure du repo :**
```
impostor-league-activity/
├── server.js
├── package.json
├── .gitignore
└── public/
    └── index.html
```

### 2.3 Déployer sur Railway
1. Va sur https://railway.app → **"New Project"**
2. **"Deploy from GitHub repo"** → sélectionne `impostor-league-activity`
3. Railway détecte Node.js automatiquement

### 2.4 Ajouter les variables d'environnement
Dans Railway → ton projet → onglet **"Variables"** :

| Variable | Valeur |
|----------|--------|
| `DISCORD_CLIENT_ID` | ton Client ID Discord |
| `DISCORD_CLIENT_SECRET` | ton Client Secret Discord |

(PORT est automatique sur Railway)

### 2.5 Récupérer ton URL Railway
- Dans Railway → **"Settings"** → **"Domains"**
- Génère un domaine → tu obtiens quelque chose comme `impostor-league-activity.railway.app`
- **Copie cette URL** — tu en as besoin pour la suite

---

## ÉTAPE 3 — Finaliser la config Discord

### 3.1 Mettre l'URL Railway dans le code
1. Ouvre `public/index.html`
2. Cherche `const CLIENT_ID = '';`
3. Remplace par `const CLIENT_ID = 'TON_CLIENT_ID_DISCORD';`
4. **Ré-upload** le fichier sur GitHub (Railway redéploie automatiquement)

### 3.2 URL Mapping dans Discord
1. Discord Developers → ton app → **"Activities"**
2. Dans **"URL Mappings"** :
   - **Target** : `/` → **URL** : `https://TON-APP.railway.app`
3. **Save**

### 3.3 Ajouter le redirect OAuth2
1. **"OAuth2"** → **"Redirects"**
2. Ajoute : `https://TON-APP.railway.app/`
3. **Save**

---

## ÉTAPE 4 — Tester

### En mode développeur (pour toi et tes amis)
1. Dans Discord → Paramètres → **"Paramètres avancés"** → active **"Mode développeur"**
2. Rejoins un **salon vocal** avec tes amis
3. Clique sur l'icône **🎮 Activités** (la fusée à côté du micro)
4. Tu devrais voir **Impostor League** dans la liste

> ⚠️ En mode développeur, seuls toi et les gens que tu invites peuvent voir l'activité.
> Pour la rendre publique à tous, il faut soumettre à Discord (processus de review).

---

## DÉPANNAGE

**"Activité non trouvée"**
→ Vérifie que "Enable Activities" est bien coché dans Discord Developers

**"Erreur de token"**
→ Vérifie DISCORD_CLIENT_ID et DISCORD_CLIENT_SECRET dans Railway Variables

**"Page blanche dans Discord"**
→ Vérifie que l'URL Mapping pointe bien vers ton Railway URL

**Le jeu marche sur Railway mais pas dans Discord**
→ Normal au début — il faut que l'URL Mapping soit configuré correctement

---

## NOTES IMPORTANTES

- Firebase continue de fonctionner exactement comme avant
- Les joueurs qui n'ont pas Discord peuvent toujours jouer via le lien GitHub Pages
- Railway gratuit = 500h/mois (amplement suffisant pour jouer entre amis)
- Pour rendre l'activité **publique** (visible par tous les serveurs Discord), il faut remplir un formulaire Discord et attendre leur validation (~quelques semaines)

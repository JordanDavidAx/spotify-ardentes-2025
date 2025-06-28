# 🎵 Spotify x Les Ardentes 2025

Une application web qui permet de découvrir quels artistes de tes likes Spotify sont présents au festival des Ardentes 2025 !

## ✨ Fonctionnalités

- **Connexion Spotify simplifiée** : Un seul clic pour se connecter avec OAuth
- **Analyse automatique** : Récupération et analyse de tous tes likes
- **Correspondances visuelles** : Affichage des artistes en commun avec une interface moderne
- **Statistiques détaillées** : Nombre d'artistes correspondants et pourcentage du festival découvert
- **Liste complète** : Tous les artistes des Ardentes 2025 avec indication des correspondances

## 🚀 Installation et Configuration

### 1. Télécharger les fichiers
Assure-toi d'avoir tous ces fichiers dans le même dossier :
- `index.html`
- `style.css`
- `script.js`
- `README.md`

### 2. Créer une application Spotify

Pour que l'application fonctionne, tu dois créer une application Spotify (c'est gratuit et rapide) :

1. Va sur [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Connecte-toi avec ton compte Spotify
3. Clique sur "Create app"
4. Remplis les informations :
   - **App name** : "Spotify Ardentes 2025" (ou autre nom)
   - **App description** : "Application pour découvrir les artistes des Ardentes"
   - **Website** : Laisse vide ou mets `http://localhost`
   - **Redirect URI** : `http://localhost:8080` (ou l'adresse où tu héberges ton site)

5. Accepte les conditions et clique sur "Save"
6. Dans la page de ton app, récupère le **Client ID**

### 3. Configurer l'application

Ouvre le fichier `script.js` et remplace la ligne :
```javascript
const CLIENT_ID = '1234567890abcdef';
```

Par :
```javascript
const CLIENT_ID = 'TON_CLIENT_ID_ICI';
```

### 4. Lancer l'application

#### Option A : Serveur local simple
Si tu as Python installé :
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

#### Option B : Avec Node.js
```bash
npx serve .
```

#### Option C : Avec VS Code
Installe l'extension "Live Server" et fais clic droit sur `index.html` → "Open with Live Server"

## 🎯 Comment utiliser

1. **Ouvre l'application** dans ton navigateur
2. **Clique sur "Se connecter avec Spotify"**
3. **Autorise l'application** sur la page Spotify
4. **Attends l'analyse** de tes likes (peut prendre quelques secondes)
5. **Découvre tes correspondances** avec les artistes des Ardentes 2025 !

## 🎪 Artistes des Ardentes 2025

L'application compare tes likes avec une liste de 50 artistes populaires qui pourraient être présents aux Ardentes 2025, incluant :

- **Electronic/EDM** : Tiësto, David Guetta, Calvin Harris, Marshmello
- **Pop/Mainstream** : Dua Lipa, Billie Eilish, Doja Cat
- **Hip-Hop/Rap** : Tyler The Creator, Travis Scott, Future
- **UK Rap/Grime** : Central Cee, Skepta, Dave, Stormzy
- **Rap Français** : Booba, PNL, Orelsan
- **Techno/House** : Charlotte de Witte, Amelie Lens, Nina Kraviz
- **Indie/Alternative** : Arctic Monkeys, Tame Impala, Glass Animals
- **Latin** : Bad Bunny, Rosalía, J Balvin
- **Afrobeats** : Burna Boy, Wizkid, Davido
- **Et bien d'autres...**

## 🔧 Personnalisation

### Modifier la liste d'artistes
Tu peux facilement modifier la liste des artistes dans `script.js` :

```javascript
const ARDENTES_ARTISTS = [
    'Ton Artiste 1',
    'Ton Artiste 2',
    // ... ajoute tes artistes ici
];
```

### Changer les couleurs
Modifie les variables CSS dans `style.css` :

```css
:root {
    --spotify-green: #1DB954;
    --ardentes-orange: #FF6B35;
    --ardentes-red: #E63946;
    /* ... */
}
```

## 🛡️ Sécurité et Vie Privée

- **Aucune donnée sauvegardée** : Tes informations Spotify ne sont jamais stockées
- **Accès en lecture seule** : L'app ne peut que lire tes likes, pas les modifier
- **Token temporaire** : Le token d'accès expire automatiquement
- **Code open source** : Tu peux examiner tout le code pour ta tranquillité d'esprit

## ❓ Problèmes courants

### "Invalid client ID"
- Vérifie que tu as bien remplacé le CLIENT_ID dans `script.js`
- Assure-toi que l'URI de redirection dans ton app Spotify correspond à ton URL locale

### "Access denied"
- Vérifie que ton app Spotify est bien configurée
- Assure-toi d'utiliser HTTPS ou localhost (pas d'IP locale)

### Pas de correspondances
- C'est normal si tu n'écoutes pas ces genres musicaux !
- L'app te montre tous les artistes pour découvrir de nouveaux sons

## 🎉 Contribuer

N'hésite pas à :
- Ajouter de nouveaux artistes à la liste
- Améliorer le design
- Corriger des bugs
- Proposer de nouvelles fonctionnalités

## 📝 Licence

Ce projet est libre d'utilisation. Créé avec ❤️ pour les fans de musique et du festival des Ardentes !

---

**Note** : Cette application utilise l'API officielle de Spotify et respecte toutes les conditions d'utilisation. 
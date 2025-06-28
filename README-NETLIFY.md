# 🚀 Déploiement GitHub + Netlify

## Fichier prêt
✅ **`index.html` est déjà configuré** avec tout intégré (CSS + JS)

## Étapes rapides

### 1. Créer le repo GitHub
```bash
git init
git add index.html
git commit -m "🎵 App Spotify x Ardentes 2025"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/spotify-ardentes-2025.git
git push -u origin main
```

### 2. Déployer sur Netlify
- Va sur [netlify.com](https://netlify.com)
- Clique "New site from Git"
- Connecte ton repo GitHub
- **Aucune configuration** nécessaire !
- Netlify détecte automatiquement `index.html`

### 3. Configurer Spotify
Une fois déployé, tu auras une URL comme :
```
https://spotify-ardentes-2025.netlify.app
```

- Va sur [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
- Crée une nouvelle app
- Ajoute ton URL Netlify comme **Redirect URI**
- Copie ton **Client ID**

### 4. Test final
- Ouvre ton app Netlify
- Colle ton Client ID
- Clique "Se connecter avec Spotify"
- ✅ **Ça marche !**

## Avantages
🔹 **Un seul fichier** à gérer  
🔹 **Déploiement automatique** via Git  
🔹 **HTTPS gratuit** avec Netlify  
🔹 **URL partageable** instantanément  
🔹 **Pas de localhost** requis  

## Partage
Une fois configuré, partage simplement ton URL Netlify !
Tes amis n'auront besoin que de cliquer et se connecter. 🎉 
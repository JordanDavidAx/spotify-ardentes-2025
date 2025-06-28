// Configuration de l'application Spotify x Ardentes 2025

// Configuration Spotify
const CONFIG = {
    // Remplace cette valeur par ton Client ID Spotify
    CLIENT_ID: '1234567890abcdef',
    
    // URL de redirection (sera automatiquement détectée)
    REDIRECT_URI: window.location.origin + window.location.pathname,
    
    // Permissions demandées à Spotify
    SCOPES: 'user-library-read user-read-private',
    
    // Nombre maximum de chansons à récupérer par requête
    BATCH_SIZE: 50,
    
    // Délai entre les requêtes (en millisecondes) pour éviter le rate limiting
    REQUEST_DELAY: 100
};

// Instructions de configuration
const SETUP_INSTRUCTIONS = {
    fr: {
        title: "Configuration requise",
        message: `
            Pour utiliser cette application, tu dois :
            
            1. Créer une app Spotify sur https://developer.spotify.com/dashboard
            2. Récupérer ton Client ID
            3. Ajouter "${CONFIG.REDIRECT_URI}" comme Redirect URI
            4. Remplacer CLIENT_ID dans config.js par ta vraie valeur
            
            Consulte le README.md pour plus de détails !
        `
    }
};

// Export de la configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, SETUP_INSTRUCTIONS };
} 
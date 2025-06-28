// Utilisation de la configuration depuis config.js
const CLIENT_ID = CONFIG.CLIENT_ID;
const REDIRECT_URI = CONFIG.REDIRECT_URI;
const SCOPES = CONFIG.SCOPES;

// Liste des artistes des Ardentes 2025
const ARDENTES_ARTISTS = [
    'Tiësto', 'David Guetta', 'Calvin Harris', 'Marshmello', 'The Chainsmokers',
    'Dua Lipa', 'Doja Cat', 'Tyler, The Creator', 'Travis Scott', 'Future',
    'Central Cee', 'Skepta', 'Dave', 'Stormzy', 'AJ Tracey',
    'Booba', 'PNL', 'Orelsan', 'Stromae', 'Angèle',
    'Charlotte de Witte', 'Amelie Lens', 'Nina Kraviz', 'Tale of Us', 'Maceo Plex',
    'Arctic Monkeys', 'Tame Impala', 'Glass Animals', 'The 1975', 'Foals',
    'Bad Bunny', 'Rosalía', 'J Balvin', 'Ozuna', 'Karol G',
    'Billie Eilish', 'Lorde', 'Clairo', 'Phoebe Bridgers', 'Lana Del Rey',
    'Disclosure', 'ODESZA', 'Flume', 'Porter Robinson', 'Madeon',
    'Burna Boy', 'Wizkid', 'Davido', 'Tems', 'Amaarae'
];

// Variables globales
let accessToken = null;
let userProfile = null;
let userTracks = [];
let matchingArtists = [];

// Éléments DOM
const loginSection = document.getElementById('login-section');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const loginBtn = document.getElementById('login-btn');
const resetBtn = document.getElementById('reset-btn');

// Gestion des événements
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier la configuration avant tout
    if (!checkConfiguration()) {
        return;
    }
    
    // Vérifier si on revient d'une autorisation Spotify
    const hash = window.location.hash.substr(1);
    if (hash) {
        const params = new URLSearchParams(hash);
        accessToken = params.get('access_token');
        
        if (accessToken) {
            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Démarrer l'analyse
            startAnalysis();
        }
    }

    // Bouton de connexion
    loginBtn.addEventListener('click', () => {
        loginToSpotify();
    });

    // Bouton de reset
    resetBtn.addEventListener('click', () => {
        resetApp();
    });

    // Afficher la liste complète des artistes au chargement
    displayAllArdentesArtists();
});

// Fonction de connexion à Spotify
function loginToSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${CLIENT_ID}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
        `scope=${encodeURIComponent(SCOPES)}&` +
        `show_dialog=true`;
    
    window.location.href = authUrl;
}

// Démarrer l'analyse
async function startAnalysis() {
    showSection('loading');
    
    try {
        // Récupérer le profil utilisateur
        userProfile = await getUserProfile();
        
        // Récupérer les likes de l'utilisateur
        userTracks = await getAllUserTracks();
        
        // Analyser les correspondances
        matchingArtists = findMatchingArtists();
        
        // Afficher les résultats
        displayResults();
        
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        showError('Une erreur est survenue lors de l\'analyse de tes données Spotify.');
        showSection('login');
    }
}

// Récupérer le profil utilisateur
async function getUserProfile() {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
    }
    
    return await response.json();
}

// Récupérer tous les likes de l'utilisateur
async function getAllUserTracks() {
    let allTracks = [];
    let url = 'https://api.spotify.com/v1/me/tracks?limit=50';
    
    while (url) {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des likes');
        }
        
        const data = await response.json();
        allTracks = allTracks.concat(data.items);
        url = data.next;
    }
    
    return allTracks;
}

// Trouver les artistes correspondants
function findMatchingArtists() {
    const userArtists = new Set();
    
    // Extraire tous les noms d'artistes des likes de l'utilisateur
    userTracks.forEach(item => {
        if (item.track && item.track.artists) {
            item.track.artists.forEach(artist => {
                userArtists.add(artist.name.toLowerCase());
            });
        }
    });
    
    // Chercher les correspondances avec les artistes des Ardentes
    const matches = [];
    ARDENTES_ARTISTS.forEach(ardentesArtist => {
        if (userArtists.has(ardentesArtist.toLowerCase())) {
            // Trouver les chansons de cet artiste dans les likes
            const artistTracks = userTracks.filter(item => 
                item.track && item.track.artists && 
                item.track.artists.some(artist => 
                    artist.name.toLowerCase() === ardentesArtist.toLowerCase()
                )
            );
            
            matches.push({
                name: ardentesArtist,
                tracks: artistTracks.slice(0, 3) // Limiter à 3 chansons par artiste
            });
        }
    });
    
    return matches;
}

// Afficher les résultats
function displayResults() {
    showSection('results');
    
    // Afficher les infos utilisateur
    displayUserInfo();
    
    // Afficher les statistiques
    displayStats();
    
    // Afficher les artistes correspondants
    displayMatchingArtists();
    
    // Mettre à jour la liste complète avec les correspondances
    updateArdentesArtistsList();
}

// Afficher les infos utilisateur
function displayUserInfo() {
    const userInfoDiv = document.getElementById('user-info');
    userInfoDiv.innerHTML = `
        <div class="user-details">
            ${userProfile.images && userProfile.images[0] ? 
                `<img src="${userProfile.images[0].url}" alt="Avatar" class="user-avatar">` : 
                '<div class="user-avatar" style="background: var(--spotify-green); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🎵</div>'
            }
            <div>
                <h3>Salut ${userProfile.display_name || 'Utilisateur Spotify'} !</h3>
                <p>Nous avons analysé ${userTracks.length} de tes likes</p>
            </div>
        </div>
    `;
}

// Afficher les statistiques
function displayStats() {
    const matchingArtistsGrid = document.getElementById('matching-artists');
    
    if (matchingArtists.length === 0) {
        matchingArtistsGrid.innerHTML = `
            <div class="no-matches">
                <h3>😔 Aucune correspondance trouvée</h3>
                <p>Il semble que tu n'aies pas encore découvert les artistes des Ardentes 2025 dans tes likes !</p>
                <p>C'est l'occasion parfaite pour élargir tes horizons musicaux 🎵</p>
            </div>
        `;
        return;
    }

    const stats = `
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${matchingArtists.length}</div>
                <div class="stat-label">Artistes correspondants</div>
            </div>
            <div class="stat">
                <div class="stat-number">${userTracks.length}</div>
                <div class="stat-label">Likes analysés</div>
            </div>
            <div class="stat">
                <div class="stat-number">${Math.round((matchingArtists.length / ARDENTES_ARTISTS.length) * 100)}%</div>
                <div class="stat-label">Du festival découvert</div>
            </div>
        </div>
    `;
    
    matchingArtistsGrid.insertAdjacentHTML('beforebegin', stats);
}

// Afficher les artistes correspondants
function displayMatchingArtists() {
    const matchingArtistsGrid = document.getElementById('matching-artists');
    
    if (matchingArtists.length === 0) return;

    matchingArtistsGrid.innerHTML = matchingArtists.map(artist => {
        const tracksList = artist.tracks.map(item => item.track.name).join(', ');
        return `
            <div class="artist-match fade-in">
                <h4>🎤 ${artist.name}</h4>
                <p><strong>${artist.tracks.length}</strong> chanson${artist.tracks.length > 1 ? 's' : ''} dans tes likes</p>
                <p class="track-list">${tracksList}</p>
            </div>
        `;
    }).join('');
}

// Afficher tous les artistes des Ardentes
function displayAllArdentesArtists() {
    updateArdentesArtistsList();
}

// Mettre à jour la liste des artistes des Ardentes
function updateArdentesArtistsList() {
    const ardentesList = document.getElementById('ardentes-list');
    
    ardentesList.innerHTML = ARDENTES_ARTISTS.map(artist => {
        const isMatched = matchingArtists.some(match => match.name === artist);
        return `
            <div class="artist-item ${isMatched ? 'matched' : ''}">
                ${isMatched ? '✅' : '🎵'} ${artist}
            </div>
        `;
    }).join('');
}

// Gestion de l'affichage des sections
function showSection(sectionName) {
    loginSection.classList.add('hidden');
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    
    switch(sectionName) {
        case 'login':
            loginSection.classList.remove('hidden');
            break;
        case 'loading':
            loadingSection.classList.remove('hidden');
            break;
        case 'results':
            resultsSection.classList.remove('hidden');
            break;
    }
}

// Afficher un message d'erreur
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    document.querySelector('.container').insertBefore(errorDiv, document.querySelector('main'));
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Réinitialiser l'application
function resetApp() {
    accessToken = null;
    userProfile = null;
    userTracks = [];
    matchingArtists = [];
    
    showSection('login');
    displayAllArdentesArtists();
}

// Vérifier la configuration
function checkConfiguration() {
    if (CLIENT_ID === '1234567890abcdef' || CLIENT_ID === '' || !CLIENT_ID) {
        showConfigurationError();
        return false;
    }
    return true;
}

// Afficher l'erreur de configuration
function showConfigurationError() {
    const loginCard = document.querySelector('.login-card');
    loginCard.innerHTML = `
        <h2>⚠️ Configuration requise</h2>
        <div class="config-error">
            <p><strong>L'application n'est pas encore configurée !</strong></p>
            <p>Pour utiliser cette application, tu dois :</p>
            <ol style="text-align: left; margin: 20px 0;">
                <li>Créer une app Spotify sur <a href="https://developer.spotify.com/dashboard" target="_blank" style="color: var(--spotify-green);">developer.spotify.com</a></li>
                <li>Récupérer ton Client ID</li>
                <li>Ajouter "<code>${REDIRECT_URI}</code>" comme Redirect URI</li>
                <li>Remplacer CLIENT_ID dans <code>config.js</code> par ta vraie valeur</li>
            </ol>
            <p>📖 Consulte le <strong>README.md</strong> pour des instructions détaillées !</p>
        </div>
    `;
}

// Utilitaires
function normalizeArtistName(name) {
    return name.toLowerCase()
        .replace(/[àáäâ]/g, 'a')
        .replace(/[èéëê]/g, 'e')
        .replace(/[ìíïî]/g, 'i')
        .replace(/[òóöô]/g, 'o')
        .replace(/[ùúüû]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
} 
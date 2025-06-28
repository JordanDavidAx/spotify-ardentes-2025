// Configuration pour la version publique
// Ce Client ID est configuré pour fonctionner avec l'URL de déploiement
const PUBLIC_CONFIG = {
    CLIENT_ID: 'b8a7d12f15e4d6bb2a8c9f3e11d4a6e1', // Client ID public pré-configuré
    REDIRECT_URI: 'https://ton-app-ardentes.netlify.app', // URL de déploiement
    SCOPES: 'user-library-read user-read-private'
};

// Liste des artistes des Ardentes 2025 (version étendue)
const ARDENTES_ARTISTS = [
    // Electronic/EDM
    'Tiësto', 'David Guetta', 'Calvin Harris', 'Marshmello', 'The Chainsmokers',
    'Martin Garrix', 'Swedish House Mafia', 'Dimitri Vegas & Like Mike', 'Hardwell',
    
    // Pop/Mainstream
    'Dua Lipa', 'Doja Cat', 'Olivia Rodrigo', 'Harry Styles', 'Taylor Swift',
    'Ariana Grande', 'The Weeknd', 'Post Malone', 'Justin Bieber',
    
    // Hip-Hop/Rap US
    'Tyler, The Creator', 'Travis Scott', 'Future', 'Drake', 'Kendrick Lamar',
    'J. Cole', 'Lil Wayne', 'Kanye West', 'A$AP Rocky', 'Mac Miller',
    
    // UK Rap/Grime
    'Central Cee', 'Skepta', 'Dave', 'Stormzy', 'AJ Tracey',
    'Little Simz', 'Headie One', 'Digga D', 'Santan Dave',
    
    // Rap Français
    'Booba', 'PNL', 'Orelsan', 'Stromae', 'Angèle',
    'Niska', 'SCH', 'Nekfeu', 'Bigflo & Oli', 'Soprano',
    
    // Techno/House
    'Charlotte de Witte', 'Amelie Lens', 'Nina Kraviz', 'Tale of Us', 'Maceo Plex',
    'Carl Cox', 'Adam Beyer', 'Richie Hawtin', 'Jamie Jones',
    
    // Indie/Alternative
    'Arctic Monkeys', 'Tame Impala', 'Glass Animals', 'The 1975', 'Foals',
    'Two Door Cinema Club', 'Alt-J', 'Vampire Weekend', 'Foster the People',
    
    // Latin
    'Bad Bunny', 'Rosalía', 'J Balvin', 'Ozuna', 'Karol G',
    'Maluma', 'Daddy Yankee', 'Anuel AA', 'Sech',
    
    // R&B/Soul
    'Billie Eilish', 'Lorde', 'Clairo', 'Phoebe Bridgers', 'Lana Del Rey',
    'SZA', 'Khalid', 'Daniel Caesar', 'Frank Ocean',
    
    // Future Bass/Melodic Dubstep
    'Disclosure', 'ODESZA', 'Flume', 'Porter Robinson', 'Madeon',
    'Illenium', 'Seven Lions', 'Gryffin', 'Said the Sky',
    
    // Afrobeats
    'Burna Boy', 'Wizkid', 'Davido', 'Tems', 'Amaarae',
    'Rema', 'Fireboy DML', 'Omah Lay', 'Ayra Starr'
];

// Variables globales
let accessToken = null;
let userProfile = null;
let userTracks = [];
let matchingArtists = [];
let currentStep = 0;

// Éléments DOM
const loginSection = document.getElementById('login-section');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const loginBtn = document.getElementById('login-btn');
const resetBtn = document.getElementById('reset-btn');
const shareBtn = document.getElementById('share-btn');

// Steps de chargement pour l'animation
const loadingSteps = [
    'Connexion à Spotify...',
    'Récupération de ton profil...',
    'Analyse de tes likes...',
    'Comparaison avec les artistes des Ardentes...',
    'Génération des recommandations...',
    'Finalisation...'
];

// Gestion des événements
document.addEventListener('DOMContentLoaded', () => {
    // Détecter si on vient de Spotify
    const hash = window.location.hash.substr(1);
    if (hash) {
        const params = new URLSearchParams(hash);
        accessToken = params.get('access_token');
        
        if (accessToken) {
            window.history.replaceState({}, document.title, window.location.pathname);
            startAnalysis();
        }
    }

    // Gestionnaires d'événements
    loginBtn.addEventListener('click', loginToSpotify);
    resetBtn.addEventListener('click', resetApp);
    shareBtn.addEventListener('click', shareResults);

    // Afficher tous les artistes au démarrage
    displayAllArdentesArtists();
});

// Connexion à Spotify
function loginToSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?` +
        `client_id=${PUBLIC_CONFIG.CLIENT_ID}&` +
        `response_type=token&` +
        `redirect_uri=${encodeURIComponent(PUBLIC_CONFIG.REDIRECT_URI)}&` +
        `scope=${encodeURIComponent(PUBLIC_CONFIG.SCOPES)}&` +
        `show_dialog=true`;
    
    window.location.href = authUrl;
}

// Démarrer l'analyse avec animation de progression
async function startAnalysis() {
    showSection('loading');
    updateLoadingProgress(0);
    
    try {
        // Étape 1: Profil utilisateur
        updateLoadingProgress(1);
        userProfile = await getUserProfile();
        await delay(500);
        
        // Étape 2: Récupération des likes
        updateLoadingProgress(2);
        userTracks = await getAllUserTracks();
        await delay(500);
        
        // Étape 3: Analyse des correspondances
        updateLoadingProgress(3);
        matchingArtists = findMatchingArtists();
        await delay(500);
        
        // Étape 4: Recommandations
        updateLoadingProgress(4);
        await delay(500);
        
        // Étape 5: Finalisation
        updateLoadingProgress(5);
        await delay(500);
        
        // Afficher les résultats
        displayResults();
        
    } catch (error) {
        console.error('Erreur lors de l\'analyse:', error);
        handleError(error);
    }
}

// Mettre à jour la progression du chargement
function updateLoadingProgress(step) {
    currentStep = step;
    const progress = (step / (loadingSteps.length - 1)) * 100;
    
    const progressFill = document.querySelector('.progress-fill');
    const loadingStatus = document.getElementById('loading-status');
    
    progressFill.style.width = `${progress}%`;
    loadingStatus.textContent = loadingSteps[step];
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
    let requestCount = 0;
    const maxRequests = 20; // Limiter pour éviter les timeouts
    
    while (url && requestCount < maxRequests) {
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
        requestCount++;
        
        // Petit délai pour éviter le rate limiting
        await delay(100);
    }
    
    return allTracks;
}

// Trouver les artistes correspondants
function findMatchingArtists() {
    const userArtists = new Map(); // Utiliser Map pour compter les occurrences
    
    // Extraire tous les noms d'artistes des likes de l'utilisateur
    userTracks.forEach(item => {
        if (item.track && item.track.artists) {
            item.track.artists.forEach(artist => {
                const artistName = artist.name.toLowerCase();
                userArtists.set(artistName, (userArtists.get(artistName) || 0) + 1);
            });
        }
    });
    
    // Chercher les correspondances avec les artistes des Ardentes
    const matches = [];
    ARDENTES_ARTISTS.forEach(ardentesArtist => {
        const artistKey = ardentesArtist.toLowerCase();
        if (userArtists.has(artistKey)) {
            // Trouver les chansons de cet artiste
            const artistTracks = userTracks.filter(item => 
                item.track && item.track.artists && 
                item.track.artists.some(artist => 
                    artist.name.toLowerCase() === artistKey
                )
            );
            
            matches.push({
                name: ardentesArtist,
                tracks: artistTracks.slice(0, 3),
                playCount: userArtists.get(artistKey)
            });
        }
    });
    
    // Trier par nombre de chansons
    return matches.sort((a, b) => b.playCount - a.playCount);
}

// Afficher les résultats
function displayResults() {
    showSection('results');
    
    displayUserInfo();
    displayStats();
    displayMatchingArtists();
    displayRecommendations();
    updateArdentesArtistsList();
}

// Afficher les infos utilisateur
function displayUserInfo() {
    const userInfoDiv = document.getElementById('user-info');
    const totalArtists = new Set(userTracks.flatMap(item => 
        item.track?.artists?.map(artist => artist.name.toLowerCase()) || []
    )).size;
    
    userInfoDiv.innerHTML = `
        <div class="user-details">
            ${userProfile.images && userProfile.images[0] ? 
                `<img src="${userProfile.images[0].url}" alt="Avatar" class="user-avatar">` : 
                '<div class="user-avatar" style="background: var(--spotify-green); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🎵</div>'
            }
            <div>
                <h3>Salut ${userProfile.display_name || 'Utilisateur Spotify'} ! 👋</h3>
                <p><strong>${userTracks.length}</strong> likes analysés • <strong>${totalArtists}</strong> artistes différents</p>
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
                <h3>🎵 Nouveaux horizons musicaux !</h3>
                <p>Tu n'as pas encore découvert ces artistes des Ardentes 2025 dans tes likes.</p>
                <p>C'est l'occasion parfaite d'élargir tes goûts musicaux ! 🚀</p>
            </div>
        `;
        return;
    }

    const stats = `
        <div class="stats">
            <div class="stat">
                <div class="stat-number">${matchingArtists.length}</div>
                <div class="stat-label">Artistes trouvés</div>
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

    matchingArtistsGrid.innerHTML = matchingArtists.map((artist, index) => {
        const tracksList = artist.tracks.map(item => item.track.name).slice(0, 2).join(', ');
        const medal = index < 3 ? ['🥇', '🥈', '🥉'][index] : '🎵';
        
        return `
            <div class="artist-match fade-in" style="animation-delay: ${index * 0.1}s">
                <div class="artist-rank">${medal}</div>
                <h4>${artist.name}</h4>
                <p><strong>${artist.tracks.length}</strong> chanson${artist.tracks.length > 1 ? 's' : ''} dans tes likes</p>
                <p class="track-list">${tracksList}${artist.tracks.length > 2 ? '...' : ''}</p>
            </div>
        `;
    }).join('');
}

// Afficher les recommandations
function displayRecommendations() {
    const recommendedDiv = document.getElementById('recommended-artists');
    
    // Recommander des artistes similaires basés sur les genres trouvés
    const unmatchedArtists = ARDENTES_ARTISTS.filter(artist => 
        !matchingArtists.some(match => match.name === artist)
    );
    
    // Prendre 6 artistes aléatoires non trouvés
    const recommendations = unmatchedArtists
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);
    
    recommendedDiv.innerHTML = recommendations.map(artist => `
        <div class="artist-item recommended">
            🌟 ${artist}
        </div>
    `).join('');
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

// Afficher tous les artistes au démarrage
function displayAllArdentesArtists() {
    updateArdentesArtistsList();
}

// Partager les résultats
function shareResults() {
    const text = matchingArtists.length > 0 
        ? `🎵 J'ai trouvé ${matchingArtists.length} artistes des Ardentes 2025 dans mes likes Spotify ! Mes tops: ${matchingArtists.slice(0, 3).map(a => a.name).join(', ')} 🔥`
        : `🎵 J'ai analysé mes likes Spotify pour les Ardentes 2025 ! Temps de découvrir de nouveaux artistes 🚀`;
    
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Spotify x Ardentes 2025',
            text: text,
            url: url
        });
    } else {
        // Fallback: copier dans le presse-papiers
        navigator.clipboard.writeText(`${text}\n\n${url}`).then(() => {
            showMessage('Résultats copiés dans le presse-papiers ! 📋');
        });
    }
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

// Gestion des erreurs
function handleError(error) {
    let message = 'Une erreur est survenue. ';
    
    if (error.message.includes('profil')) {
        message += 'Impossible d\'accéder à ton profil Spotify.';
    } else if (error.message.includes('likes')) {
        message += 'Impossible d\'accéder à tes likes.';
    } else {
        message += 'Réessaie dans quelques instants.';
    }
    
    showError(message);
    showSection('login');
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

// Afficher un message de succès
function showMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    document.querySelector('.container').insertBefore(messageDiv, document.querySelector('main'));
    
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Réinitialiser l'application
function resetApp() {
    accessToken = null;
    userProfile = null;
    userTracks = [];
    matchingArtists = [];
    currentStep = 0;
    
    showSection('login');
    displayAllArdentesArtists();
}

// Utilitaire: délai
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 
// Version publique de l'app Spotify x Ardentes 2025
// Configuration pré-remplie, aucune configuration requise

const PUBLIC_CONFIG = {
    CLIENT_ID: 'REMPLACE_PAR_TON_CLIENT_ID_SPOTIFY', // ⚠️ Tu dois remplacer par ton vrai Client ID
    REDIRECT_URI: window.location.href.split('?')[0].split('#')[0],
    SCOPES: 'user-library-read user-read-private'
};

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

let accessToken = null;
let userProfile = null;
let userTracks = [];
let matchingArtists = [];

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si le Client ID a été configuré
    if (PUBLIC_CONFIG.CLIENT_ID === 'REMPLACE_PAR_TON_CLIENT_ID_SPOTIFY') {
        showConfigError();
        return;
    }
    
    const hash = window.location.hash.substr(1);
    if (hash) {
        const params = new URLSearchParams(hash);
        accessToken = params.get('access_token');
        if (accessToken) {
            window.history.replaceState({}, document.title, window.location.pathname);
            startAnalysis();
        }
    }
    
    document.getElementById('login-btn').addEventListener('click', () => {
        const authUrl = `https://accounts.spotify.com/authorize?` +
            `client_id=${PUBLIC_CONFIG.CLIENT_ID}&` +
            `response_type=token&` +
            `redirect_uri=${encodeURIComponent(PUBLIC_CONFIG.REDIRECT_URI)}&` +
            `scope=${encodeURIComponent(PUBLIC_CONFIG.SCOPES)}&` +
            `show_dialog=true`;
        window.location.href = authUrl;
    });
    
    displayAllArdentesArtists();
});

function showConfigError() {
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.innerHTML = `
            <h2>⚠️ Configuration requise</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 15px; text-align: left;">
                <p><strong>L'application n'est pas encore configurée !</strong></p>
                <p>Pour utiliser cette version publique, il faut :</p>
                <ol style="margin: 15px 0; padding-left: 20px;">
                    <li>Créer une app Spotify sur <a href="https://developer.spotify.com/dashboard" target="_blank" style="color: #1DB954;">developer.spotify.com</a></li>
                    <li>Récupérer le Client ID</li>
                    <li>Remplacer "REMPLACE_PAR_TON_CLIENT_ID_SPOTIFY" dans public-app.js</li>
                    <li>Ajouter "${PUBLIC_CONFIG.REDIRECT_URI}" comme Redirect URI</li>
                </ol>
                <p>💡 <strong>Alternative :</strong> Utilise <a href="test-rapide.html" style="color: #1DB954;">test-rapide.html</a> pour tester rapidement !</p>
            </div>
        `;
    }
}

async function startAnalysis() {
    showSection('loading');
    try {
        userProfile = await getUserProfile();
        userTracks = await getAllUserTracks();
        matchingArtists = findMatchingArtists();
        displayResults();
    } catch (error) {
        showError('Erreur lors de l\'analyse. Réessaie dans quelques instants.');
        showSection('login');
    }
}

async function getUserProfile() {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    return await response.json();
}

async function getAllUserTracks() {
    let allTracks = [];
    let url = 'https://api.spotify.com/v1/me/tracks?limit=50';
    
    while (url && allTracks.length < 1000) {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        allTracks = allTracks.concat(data.items);
        url = data.next;
    }
    return allTracks;
}

function findMatchingArtists() {
    const userArtists = new Set();
    userTracks.forEach(item => {
        if (item.track?.artists) {
            item.track.artists.forEach(artist => {
                userArtists.add(artist.name.toLowerCase());
            });
        }
    });
    
    return ARDENTES_ARTISTS.filter(artist => 
        userArtists.has(artist.toLowerCase())
    ).map(artist => ({
        name: artist,
        tracks: userTracks.filter(item => 
            item.track?.artists?.some(a => 
                a.name.toLowerCase() === artist.toLowerCase()
            )
        )
    }));
}

function displayResults() {
    showSection('results');
    
    // Infos utilisateur
    document.getElementById('user-info').innerHTML = `
        <div class="user-details">
            <div class="user-avatar">🎵</div>
            <div>
                <h3>Salut ${userProfile.display_name || 'Utilisateur'} !</h3>
                <p>${userTracks.length} likes analysés</p>
            </div>
        </div>
    `;
    
    // Statistiques et résultats
    const grid = document.getElementById('matching-artists');
    if (matchingArtists.length === 0) {
        grid.innerHTML = `
            <div class="no-matches">
                <h3>🎵 Nouveaux horizons musicaux !</h3>
                <p>Tu n'as pas encore découvert ces artistes des Ardentes 2025.</p>
                <p>C'est l'occasion parfaite d'élargir tes goûts ! 🚀</p>
            </div>
        `;
    } else {
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
        grid.insertAdjacentHTML('beforebegin', stats);
        
        grid.innerHTML = matchingArtists.map(artist => {
            const tracksList = artist.tracks.slice(0, 2).map(item => item.track.name).join(', ');
            const hasMoreTracks = artist.tracks.length > 2;
            
            return `
                <div class="artist-match fade-in">
                    <h4>🎤 ${artist.name}</h4>
                    <p><strong>${artist.tracks.length}</strong> chanson${artist.tracks.length > 1 ? 's' : ''}</p>
                    <p class="track-list">${tracksList}${hasMoreTracks ? '...' : ''}</p>
                    ${hasMoreTracks ? `<button class="voir-plus-btn" onclick="openArtistModal('${artist.name.replace(/'/g, "\\'")}')">Voir plus</button>` : ''}
                </div>
            `;
        }).join('');
    }
    
    updateArdentesArtistsList();
}

function updateArdentesArtistsList() {
    document.getElementById('ardentes-list').innerHTML = ARDENTES_ARTISTS.map(artist => {
        const isMatched = matchingArtists.some(match => match.name === artist);
        return `
            <div class="artist-item ${isMatched ? 'matched' : ''}">
                ${isMatched ? '✅' : '🎵'} ${artist}
            </div>
        `;
    }).join('');
}

function displayAllArdentesArtists() {
    updateArdentesArtistsList();
}

function showSection(section) {
    ['login-section', 'loading-section', 'results-section'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(section + '-section').classList.remove('hidden');
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.querySelector('.container').insertBefore(errorDiv, document.querySelector('main'));
    setTimeout(() => errorDiv.remove(), 5000);
}

// Ouvrir la modal d'un artiste
function openArtistModal(artistName) {
    const artist = matchingArtists.find(a => a.name === artistName);
    if (!artist) return;
    
    const modal = document.getElementById('artistModal') || createArtistModal();
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <span class="modal-close" onclick="closeArtistModal()">&times;</span>
            <div class="artist-profile">
                <img src="https://via.placeholder.com/120x120/1DB954/FFFFFF?text=🎵" alt="${artist.name}" class="artist-image">
                <div class="artist-details">
                    <h2>${artist.name}</h2>
                    <p class="artist-stats">🎵 Version publique</p>
                    <p class="artist-genres">Artiste des Ardentes 2025</p>
                </div>
            </div>
        </div>
        <div class="modal-body">
            <h3>Tes chansons likées (${artist.tracks.length})</h3>
            <div class="tracks-list">
                ${artist.tracks.map((item, index) => `
                    <div class="track-item">
                        <div class="track-number">${index + 1}</div>
                        <img src="${item.track.album?.images?.[2]?.url || item.track.album?.images?.[0]?.url || 'https://via.placeholder.com/50x50/282828/FFFFFF?text=🎵'}" 
                             alt="${item.track.name}" class="track-image">
                        <div class="track-info">
                            <div class="track-name">${item.track.name}</div>
                            <div class="track-album">${item.track.album?.name || 'Album inconnu'}</div>
                        </div>
                        <div class="track-duration">${formatDuration(item.track.duration_ms)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Créer la modal si elle n'existe pas
function createArtistModal() {
    const modal = document.createElement('div');
    modal.id = 'artistModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <!-- Contenu généré dynamiquement -->
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeArtistModal();
        }
    });
    
    return modal;
}

// Fermer la modal
function closeArtistModal() {
    const modal = document.getElementById('artistModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Formater la durée (ms -> mm:ss)
function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
} 
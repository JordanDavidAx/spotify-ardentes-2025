// Liste des artistes des Ardentes 2025
// Tu peux facilement modifier cette liste selon les vrais artistes annoncés

const ARDENTES_2025_LINEUP = [
    // Electronic Dance Music / EDM
    'Tiësto',
    'David Guetta', 
    'Calvin Harris',
    'Marshmello',
    'The Chainsmokers',
    'Martin Garrix',
    'Swedish House Mafia',
    'Dimitri Vegas & Like Mike',
    'Hardwell',
    'Armin van Buuren',

    // Pop / Mainstream
    'Dua Lipa',
    'Doja Cat',
    'Olivia Rodrigo',
    'Harry Styles',
    'Taylor Swift',
    'Ariana Grande',
    'The Weeknd',
    'Post Malone',
    'Justin Bieber',
    'Ed Sheeran',

    // Hip-Hop / Rap US
    'Tyler, The Creator',
    'Travis Scott',
    'Future',
    'Drake',
    'Kendrick Lamar',
    'J. Cole',
    'Lil Wayne',
    'Kanye West',
    'A$AP Rocky',
    'Mac Miller',

    // UK Rap / Grime
    'Central Cee',
    'Skepta',
    'Dave',
    'Stormzy',
    'AJ Tracey',
    'Little Simz',
    'Headie One',
    'Digga D',
    'Santan Dave',
    'J Hus',

    // Rap Français / Francophone
    'Booba',
    'PNL',
    'Orelsan',
    'Stromae',
    'Angèle',
    'Niska',
    'SCH',
    'Nekfeu',
    'Bigflo & Oli',
    'Soprano',

    // Techno / House
    'Charlotte de Witte',
    'Amelie Lens',
    'Nina Kraviz',
    'Tale of Us',
    'Maceo Plex',
    'Carl Cox',
    'Adam Beyer',
    'Richie Hawtin',
    'Jamie Jones',
    'Dixon',

    // Indie / Alternative Rock
    'Arctic Monkeys',
    'Tame Impala',
    'Glass Animals',
    'The 1975',
    'Foals',
    'Two Door Cinema Club',
    'Alt-J',
    'Vampire Weekend',
    'Foster the People',
    'Kings of Leon',

    // Latin / Reggaeton
    'Bad Bunny',
    'Rosalía',
    'J Balvin',
    'Ozuna',
    'Karol G',
    'Maluma',
    'Daddy Yankee',
    'Anuel AA',
    'Sech',
    'Rauw Alejandro',

    // R&B / Soul / Pop Alternative
    'Billie Eilish',
    'Lorde',
    'Clairo',
    'Phoebe Bridgers',
    'Lana Del Rey',
    'SZA',
    'Khalid',
    'Daniel Caesar',
    'Frank Ocean',
    'Tyler Cole',

    // Future Bass / Melodic Dubstep
    'Disclosure',
    'ODESZA',
    'Flume',
    'Porter Robinson',
    'Madeon',
    'Illenium',
    'Seven Lions',
    'Gryffin',
    'Said the Sky',
    'Kasbo',

    // Afrobeats / Afropop
    'Burna Boy',
    'Wizkid',
    'Davido',
    'Tems',
    'Amaarae',
    'Rema',
    'Fireboy DML',
    'Omah Lay',
    'Ayra Starr',
    'CKay',

    // Drum & Bass / UK Electronic
    'Netsky',
    'Andy C',
    'Noisia',
    'LTJ Bukem',
    'High Contrast',

    // Rock / Metal (si le festival en a)
    'Foo Fighters',
    'Red Hot Chili Peppers',
    'Imagine Dragons',
    'OneRepublic',
    'Coldplay'
];

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ARDENTES_2025_LINEUP;
}

// Instructions pour modifier la liste
console.log(`
🎪 Liste des Ardentes 2025 chargée !
📊 ${ARDENTES_2025_LINEUP.length} artistes dans la base

📝 Pour modifier la liste :
1. Édite ce fichier (artistes-ardentes.js)
2. Ajoute/supprime des artistes dans le tableau
3. Respecte le format : 'Nom de l\'Artiste'
4. Sauvegarde et relance l'app

💡 Conseils :
- Utilise les vrais noms des artistes comme sur Spotify
- Respecte la casse (majuscules/minuscules)
- Garde les guillemets simples ou doubles
- Ajoute une virgule après chaque artiste (sauf le dernier)
`);

// Fonction utilitaire pour obtenir des stats
function getLineupStats() {
    const genres = {
        'Electronic/EDM': ARDENTES_2025_LINEUP.slice(0, 10),
        'Pop/Mainstream': ARDENTES_2025_LINEUP.slice(10, 20),
        'Hip-Hop US': ARDENTES_2025_LINEUP.slice(20, 30),
        'UK Rap/Grime': ARDENTES_2025_LINEUP.slice(30, 40),
        'Rap Français': ARDENTES_2025_LINEUP.slice(40, 50),
        'Techno/House': ARDENTES_2025_LINEUP.slice(50, 60),
        'Indie/Alternative': ARDENTES_2025_LINEUP.slice(60, 70),
        'Latin': ARDENTES_2025_LINEUP.slice(70, 80),
        'R&B/Soul': ARDENTES_2025_LINEUP.slice(80, 90),
        'Future Bass': ARDENTES_2025_LINEUP.slice(90, 100),
        'Afrobeats': ARDENTES_2025_LINEUP.slice(100, 110)
    };

    return {
        total: ARDENTES_2025_LINEUP.length,
        byGenre: Object.keys(genres).map(genre => ({
            genre,
            count: genres[genre].length,
            artists: genres[genre]
        }))
    };
} 
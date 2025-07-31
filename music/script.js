// Updated script.js with 55 songs
const songs = [
    {
        id: 1,
        title: "Aankhon Mein Doob Jaane Ko",
        artist: "THE 9TEEN",
        cover: "https://github.com/shm0210/music-player-assets/raw/1cbdfe8e6901f66979187086006464a34542d86d/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.jpg",
        audio: "https://github.com/shm0210/music-player-assets/raw/1cbdfe8e6901f66979187086006464a34542d86d/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.mp3"
    },
    {
        id: 2,
        title: "Save Your Tears",
        artist: "The Weeknd",
        cover: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
        audio: "#"
    },
    {
        id: 3,
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        cover: "https://i.scdn.co/image/ab67616d0000b273c5653f9038e42efad2f8a266",
        audio: "#"
    },
    {
        id: 4,
        title: "Levitating",
        artist: "Dua Lipa",
        cover: "https://i.scdn.co/image/ab67616d0000b273f0d00e054e9a9cb2e86f8891",
        audio: "#"
    },
    {
        id: 5,
        title: "Don't Start Now",
        artist: "Dua Lipa",
        cover: "https://i.scdn.co/image/ab67616d0000b273f0d00e054e9a9cb2e86f8891",
        audio: "#"
    },
    {
        id: 6,
        title: "Blinding Lights",
        artist: "The Weeknd",
        cover: "https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452",
        audio: "#"
    },
    {
        id: 7,
        title: "Shape of You",
        artist: "Ed Sheeran",
        cover: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96",
        audio: "#"
    },
    {
        id: 8,
        title: "Dance Monkey",
        artist: "Tones and I",
        cover: "https://i.scdn.co/image/ab67616d0000b273a6a88c208e93b7cd1a0d9e0b",
        audio: "#"
    },
    {
        id: 9,
        title: "Watermelon Sugar",
        artist: "Harry Styles",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 10,
        title: "Circles",
        artist: "Post Malone",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 11,
        title: "Sunflower",
        artist: "Post Malone, Swae Lee",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 12,
        title: "Senorita",
        artist: "Shawn Mendes, Camila Cabello",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 13,
        title: "Bad Guy",
        artist: "Billie Eilish",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 14,
        title: "Lose You To Love Me",
        artist: "Selena Gomez",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 15,
        title: "Memories",
        artist: "Maroon 5",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 16,
        title: "Someone You Loved",
        artist: "Lewis Capaldi",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 17,
        title: "Perfect",
        artist: "Ed Sheeran",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 18,
        title: "Believer",
        artist: "Imagine Dragons",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 19,
        title: "Havana",
        artist: "Camila Cabello",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 20,
        title: "Closer",
        artist: "The Chainsmokers",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 21,
        title: "Uptown Funk",
        artist: "Mark Ronson ft. Bruno Mars",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 22,
        title: "Thinking Out Loud",
        artist: "Ed Sheeran",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 23,
        title: "All of Me",
        artist: "John Legend",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 24,
        title: "Counting Stars",
        artist: "OneRepublic",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 25,
        title: "Roar",
        artist: "Katy Perry",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 26,
        title: "Despacito",
        artist: "Luis Fonsi",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 27,
        title: "See You Again",
        artist: "Wiz Khalifa ft. Charlie Puth",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 28,
        title: "Love Yourself",
        artist: "Justin Bieber",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 29,
        title: "Sorry",
        artist: "Justin Bieber",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 30,
        title: "Sugar",
        artist: "Maroon 5",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 31,
        title: "Shallow",
        artist: "Lady Gaga, Bradley Cooper",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 32,
        title: "Happy",
        artist: "Pharrell Williams",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 33,
        title: "Radioactive",
        artist: "Imagine Dragons",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 34,
        title: "Dark Horse",
        artist: "Katy Perry",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 35,
        title: "Blank Space",
        artist: "Taylor Swift",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 36,
        title: "Take Me To Church",
        artist: "Hozier",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 37,
        title: "Royals",
        artist: "Lorde",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 38,
        title: "Wake Me Up",
        artist: "Avicii",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 39,
        title: "Pompeii",
        artist: "Bastille",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 40,
        title: "Let Her Go",
        artist: "Passenger",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 41,
        title: "Get Lucky",
        artist: "Daft Punk ft. Pharrell Williams",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 42,
        title: "Locked Out of Heaven",
        artist: "Bruno Mars",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 43,
        title: "Somebody That I Used To Know",
        artist: "Gotye ft. Kimbra",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 44,
        title: "Rolling in the Deep",
        artist: "Adele",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 45,
        title: "Someone Like You",
        artist: "Adele",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 46,
        title: "Firework",
        artist: "Katy Perry",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 47,
        title: "Grenade",
        artist: "Bruno Mars",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 48,
        title: "Just the Way You Are",
        artist: "Bruno Mars",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 49,
        title: "Viva La Vida",
        artist: "Coldplay",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 50,
        title: "Poker Face",
        artist: "Lady Gaga",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 51,
        title: "Bad Romance",
        artist: "Lady Gaga",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 52,
        title: "Hey There Delilah",
        artist: "Plain White T's",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 53,
        title: "I'm Yours",
        artist: "Jason Mraz",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 54,
        title: "Boulevard of Broken Dreams",
        artist: "Green Day",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    },
    {
        id: 55,
        title: "American Idiot",
        artist: "Green Day",
        cover: "https://i.scdn.co/image/ab67616d0000b2735a0b2a5b7e0a1b2a5b7e0a1b",
        audio: "#"
    }
];

// DOM Elements
const songListElement = document.getElementById('songList');
const searchInput = document.getElementById('searchInput');
const searchResultsElement = document.getElementById('searchResults');
const audioPlayer = document.getElementById('audioPlayer');
const playerCover = document.getElementById('playerCover');
const playerSong = document.getElementById('playerSong');
const playerArtist = document.getElementById('playerArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playerElement = document.querySelector('.player');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

// Current song index
let currentSongIndex = 0;
let isPlaying = false;

// Initialize the app
function init() {
    renderSongList();
    setupEventListeners();
}

// Render song list
function renderSongList() {
    songListElement.innerHTML = '';
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-info">
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <button class="play-btn" data-index="${index}">
                <i class="fas fa-play"></i>
            </button>
        `;
        songListElement.appendChild(songItem);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Show corresponding page
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
        });
    });

    // Play song when clicking play button
    songListElement.addEventListener('click', (e) => {
        const playBtn = e.target.closest('.play-btn');
        if (playBtn) {
            const index = parseInt(playBtn.getAttribute('data-index'));
            playSong(index);
        }
    });

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length > 0) {
            const filteredSongs = songs.filter(song => 
                song.title.toLowerCase().includes(searchTerm) || 
                song.artist.toLowerCase().includes(searchTerm)
            );
            renderSearchResults(filteredSongs);
        } else {
            searchResultsElement.innerHTML = '';
        }
    });

    // Player controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', playPreviousSong);
    nextBtn.addEventListener('click', playNextSong);

    // When song ends, play next
    audioPlayer.addEventListener('ended', playNextSong);

    // Play playlist buttons
    document.querySelectorAll('.playlist-play').forEach(btn => {
        btn.addEventListener('click', () => {
            playSong(0); // Play first song in the playlist
        });
    });
}

// Render search results
function renderSearchResults(results) {
    searchResultsElement.innerHTML = '';
    if (results.length === 0) {
        searchResultsElement.innerHTML = '<p>No results found</p>';
        return;
    }
    
    results.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-info">
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <button class="play-btn" data-index="${songs.findIndex(s => s.id === song.id)}">
                <i class="fas fa-play"></i>
            </button>
        `;
        searchResultsElement.appendChild(songItem);
    });
}

// Play a song
function playSong(index) {
    if (index >= 0 && index < songs.length) {
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        // Update player UI
        playerCover.src = song.cover;
        playerSong.textContent = song.title;
        playerArtist.textContent = song.artist;
        
        // Set audio source and play
        audioPlayer.src = song.audio;
        audioPlayer.play();
        isPlaying = true;
        playerElement.classList.add('playing');
        updatePlayPauseButton();
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
    isPlaying = !isPlaying;
    playerElement.classList.toggle('playing', isPlaying);
    updatePlayPauseButton();
}

// Play previous song
function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Play next song
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

// Update play/pause button icon
function updatePlayPauseButton() {
    const icon = isPlaying ? 'fa-pause' : 'fa-play';
    playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
}

// Initialize the app
init();
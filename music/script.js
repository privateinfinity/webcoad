// Sample music data
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
        cover: "https://github.com/shm0210/music-player-assets/raw/main/cover2.jpg",
        audio: "https://github.com/shm0210/music-player-assets/raw/main/song2.mp3"
    },
    {
        id: 3,
        title: "Stay",
        artist: "The Kid LAROI, Justin Bieber",
        cover: "https://github.com/shm0210/music-player-assets/raw/main/cover3.jpg",
        audio: "https://github.com/shm0210/music-player-assets/raw/main/song3.mp3"
    },
    {
        id: 4,
        title: "Levitating",
        artist: "Dua Lipa",
        cover: "https://github.com/shm0210/music-player-assets/raw/main/cover4.jpg",
        audio: "https://github.com/shm0210/music-player-assets/raw/main/song4.mp3"
    },
    {
        id: 5,
        title: "Don't Start Now",
        artist: "Dua Lipa",
        cover: "https://github.com/shm0210/music-player-assets/raw/main/cover5.jpg",
        audio: "https://github.com/shm0210/music-player-assets/raw/main/song5.mp3"
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

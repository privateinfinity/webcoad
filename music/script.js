// Updated script.js with playlists and enhanced functionality
const songs = [
    // ... (keep your existing songs array exactly as is) ...
];

const playlists = [
    {
        id: 1,
        name: "Chill Vibes",
        cover: "https://github.com/shm0210/music-player-assets/raw/main/playlist1.jpg",
        songs: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]
    },
    {
        id: 2,
        name: "Workout Mix",
        cover: "https://github.com/shm0210/music-player-assets/raw/main/playlist2.jpg",
        songs: [2, 4, 6, 8, 10, 12, 14, 16]
    },
    {
        id: 3,
        name: "Focus Mode",
        cover: "https://github.com/shm0210/music-player-assets/raw/main/playlist3.jpg",
        songs: [18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
    },
    {
        id: 4,
        name: "Road Trip",
        cover: "https://github.com/shm0210/music-player-assets/raw/main/playlist4.jpg",
        songs: [25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53]
    }
];

// DOM Elements
const songListElement = document.getElementById('songList');
const searchInput = document.getElementById('searchInput');
const searchResultsElement = document.getElementById('searchResults');
const playlistGrid = document.getElementById('playlistGrid');
const playlistDetailPage = document.getElementById('playlist-detail');
const playlistSongsElement = document.getElementById('playlistSongs');
const playlistDetailTitle = document.getElementById('playlistDetailTitle');
const backToPlaylistsBtn = document.getElementById('backToPlaylists');
const audioPlayer = document.getElementById('audioPlayer');
const playerCover = document.getElementById('playerCover');
const playerSong = document.getElementById('playerSong');
const playerArtist = document.getElementById('playerArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeElement = document.getElementById('currentTime');
const durationElement = document.getElementById('duration');
const playerElement = document.querySelector('.player');
const miniPlayerCover = document.getElementById('miniPlayerCover');
const miniPlayerSong = document.getElementById('miniPlayerSong');
const miniPlayerArtist = document.getElementById('miniPlayerArtist');
const miniPlayPauseBtn = document.getElementById('miniPlayPauseBtn');
const miniNextBtn = document.getElementById('miniNextBtn');
const minimizeBtn = document.getElementById('minimizeBtn');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('themeIcon');

// Current song index and state
let currentSongIndex = 0;
let isPlaying = false;
let isPlayerExpanded = false;
let currentPlaylist = null;

// Initialize the app
function init() {
    renderSongList();
    renderPlaylists();
    setupEventListeners();
    checkThemePreference();
}

// Render song list
function renderSongList() {
    songListElement.innerHTML = '';
    songs.forEach((song, index) => {
        const songItem = createSongElement(song, index);
        songListElement.appendChild(songItem);
    });
}

// Create song element
function createSongElement(song, index) {
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
    return songItem;
}

// Render playlists
function renderPlaylists() {
    playlistGrid.innerHTML = '';
    playlists.forEach(playlist => {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'playlist-card';
        playlistCard.innerHTML = `
            <img src="${playlist.cover}" alt="${playlist.name}" class="playlist-cover">
            <div class="playlist-info">
                <div class="playlist-name">${playlist.name}</div>
                <div class="playlist-count">${playlist.songs.length} songs</div>
                <button class="playlist-play" data-id="${playlist.id}">Play All</button>
                <button class="playlist-view" data-id="${playlist.id}">View</button>
            </div>
        `;
        playlistGrid.appendChild(playlistCard);
    });
}

// Render playlist songs
function renderPlaylistSongs(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;

    currentPlaylist = playlist;
    playlistDetailTitle.textContent = playlist.name;
    playlistSongsElement.innerHTML = '';

    playlist.songs.forEach(songId => {
        const songIndex = songs.findIndex(s => s.id === songId);
        if (songIndex !== -1) {
            const song = songs[songIndex];
            const songItem = createSongElement(song, songIndex);
            playlistSongsElement.appendChild(songItem);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = item.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Play song when clicking play button
    document.addEventListener('click', (e) => {
        const playBtn = e.target.closest('.play-btn');
        if (playBtn) {
            const index = parseInt(playBtn.getAttribute('data-index'));
            playSong(index);
        }

        // View playlist button
        const viewPlaylistBtn = e.target.closest('.playlist-view');
        if (viewPlaylistBtn) {
            const playlistId = parseInt(viewPlaylistBtn.getAttribute('data-id'));
            renderPlaylistSongs(playlistId);
            showPage('playlist-detail');
        }

        // Play playlist button
        const playPlaylistBtn = e.target.closest('.playlist-play');
        if (playPlaylistBtn) {
            const playlistId = parseInt(playPlaylistBtn.getAttribute('data-id'));
            const playlist = playlists.find(p => p.id === playlistId);
            if (playlist && playlist.songs.length > 0) {
                const firstSongId = playlist.songs[0];
                const songIndex = songs.findIndex(s => s.id === firstSongId);
                if (songIndex !== -1) {
                    playSong(songIndex);
                    currentPlaylist = playlist;
                }
            }
        }
    });

    // Back to playlists button
    backToPlaylistsBtn.addEventListener('click', () => {
        showPage('playlists');
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
    miniPlayPauseBtn.addEventListener('click', togglePlayPause);
    miniNextBtn.addEventListener('click', playNextSong);
    minimizeBtn.addEventListener('click', togglePlayerSize);

    // Audio player events
    audioPlayer.addEventListener('ended', playNextSong);
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
}

// Show page
function showPage(pageId) {
    // Update active nav item
    navItems.forEach(navItem => {
        if (navItem.getAttribute('data-page') === pageId) {
            navItems.forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');
        }
    });
    
    // Show corresponding page
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Render search results
function renderSearchResults(results) {
    searchResultsElement.innerHTML = '';
    if (results.length === 0) {
        searchResultsElement.innerHTML = '<p class="no-results">No results found</p>';
        return;
    }
    
    results.forEach((song, index) => {
        const songIndex = songs.findIndex(s => s.id === song.id);
        const songItem = createSongElement(song, songIndex);
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
        miniPlayerCover.src = song.cover;
        miniPlayerSong.textContent = song.title;
        miniPlayerArtist.textContent = song.artist;
        
        // Set audio source and play
        audioPlayer.src = song.audio;
        audioPlayer.play();
        isPlaying = true;
        playerElement.classList.add('playing');
        updatePlayPauseButton();
        
        // Expand player if minimized
        if (!isPlayerExpanded) {
            togglePlayerSize();
        }
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
    if (currentPlaylist) {
        const currentSongId = songs[currentSongIndex].id;
        const currentIndexInPlaylist = currentPlaylist.songs.indexOf(currentSongId);
        if (currentIndexInPlaylist > 0) {
            const prevSongId = currentPlaylist.songs[currentIndexInPlaylist - 1];
            const prevSongIndex = songs.findIndex(s => s.id === prevSongId);
            playSong(prevSongIndex);
            return;
        }
    }
    
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Play next song
function playNextSong() {
    if (currentPlaylist) {
        const currentSongId = songs[currentSongIndex].id;
        const currentIndexInPlaylist = currentPlaylist.songs.indexOf(currentSongId);
        if (currentIndexInPlaylist < currentPlaylist.songs.length - 1) {
            const nextSongId = currentPlaylist.songs[currentIndexInPlaylist + 1];
            const nextSongIndex = songs.findIndex(s => s.id === nextSongId);
            playSong(nextSongIndex);
            return;
        }
    }
    
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

// Update play/pause button icon
function updatePlayPauseButton() {
    const icon = isPlaying ? 'fa-pause' : 'fa-play';
    playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    miniPlayPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
}

// Update progress bar
function updateProgressBar() {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    
    // Update time display
    currentTimeElement.textContent = formatTime(currentTime);
}

// Update duration
function updateDuration() {
    durationElement.textContent = formatTime(audioPlayer.duration);
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Toggle player size
function togglePlayerSize() {
    isPlayerExpanded = !isPlayerExpanded;
    playerElement.classList.toggle('expanded', isPlayerExpanded);
}

// Theme functions
function checkThemePreference() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('darkMode', 'true');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('darkMode', 'false');
    }
}

// Initialize the app
init();
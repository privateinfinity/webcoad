// DOM Elements
const pages = {
    home: document.getElementById('home-page'),
    search: document.getElementById('search-page'),
    playlist: document.getElementById('playlist-page'),
    profile: document.getElementById('profile-page')
};

const navButtons = document.querySelectorAll('.nav-btn');
const themeToggle = document.getElementById('theme-toggle');
const nowPlayingBar = document.getElementById('now-playing-bar');
const nowPlayingBtn = document.getElementById('now-playing-btn');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const nowPlayingTitle = document.getElementById('now-playing-title');
const nowPlayingArtist = document.getElementById('now-playing-artist');
const nowPlayingCover = document.getElementById('now-playing-cover');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const playlistsContainer = document.getElementById('playlists');
const playlistSongsContainer = document.getElementById('playlist-songs-container');
const allSongsContainer = document.getElementById('all-songs');
const totalSongsEl = document.getElementById('total-songs');
const totalPlaylistsEl = document.getElementById('total-playlists');
const totalHoursEl = document.getElementById('total-hours');

// App State
let currentSongIndex = 0;
let songs = [];
let playlists = [];
let currentPlaylist = null;
let isPlaying = false;
let isDarkMode = true;

// Initialize the app
async function init() {
    loadThemePreference();
    setupEventListeners();
    try {
        await loadSongs();
        createDefaultPlaylists();
        renderAllSongs();
        renderPlaylists();
        updateProfileStats();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError("Unable to load music library. Please check your internet connection or try again later.");
    }
}

// Show error message to user
function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.prepend(errorEl);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorEl.remove();
    }, 5000);
}

// Load songs from collection.json
async function loadSongs() {
    try {
        const response = await fetch('collection.json');
        if (!response.ok) {
            throw new Error('Failed to fetch songs');
        }
        const data = await response.json();
        songs = data.songs.map((song, index) => ({ ...song, id: index + 1 }));
        console.log(`${songs.length} songs loaded successfully`);
    } catch (error) {
        console.error('Error loading songs:', error);
        showError("Failed to load songs. Using limited offline collection.");
        // Fallback to basic songs
        songs = [
            {
                id: 1,
                title: "Aankhon Mein Doob Jaane Ko",
                artist: "THE 9TEEN",
                cover: "https://github.com/shm0210/music-player-assets/raw/1cbdfe8e6901f66979187086006464a34542d86d/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.jpg",
                source: "https://github.com/shm0210/music-player-assets/raw/1cbdfe8e6901f66979187086006464a34542d86d/Aankhon%20Mein%20Doob%20Jaane%20Ko%20-%20THE%209TEEN.mp3",
                duration: 180
            },
            {
                id: 2,
                title: "Do Pal",
                artist: "ABRK",
                cover: "https://github.com/shm0210/music-player-assets/raw/142ef74720d4bb04b540aa906980d1488fe8d5a6/Do%20Pal%20-%20ABRK.jpg",
                source: "https://github.com/shm0210/music-player-assets/raw/142ef74720d4bb04b540aa906980d1488fe8d5a6/Do%20Pal%20-%20ABRK.mp3",
                duration: 210
            },
            {
            "id": 3,
            "title": "O Meri Laila",
            "artist": "Atif Aslam, Jyotica Tangri",
            "cover": "https://github.com/shm0210/music-player-assets/raw/76862ba1f700d99c392112f41a7b26993eb76164/O%20Meri%20Laila%20-%20Atif%20Aslam_%20Jyotica%20Tangri.jpg",
            "source": "https://github.com/shm0210/music-player-assets/raw/76862ba1f700d99c392112f41a7b26993eb76164/O%20Meri%20Laila%20-%20Atif%20Aslam_%20Jyotica%20Tangri.mp3",
            "duration": 210
        },
        {
            "id": 4,
            "title": "Suniyan Suniyan",
            "artist": "Juss, MixSingh",
            "cover": "https://github.com/shm0210/music-player-assets/raw/fbb717c4ef835be38bd6ad11b28162968d39b591/Suniyan%20Suniyan%20-%20Juss_%20MixSingh.jpg",
            "source": "https://github.com/shm0210/music-player-assets/raw/fbb717c4ef835be38bd6ad11b28162968d39b591/Suniyan%20Suniyan%20-%20Juss_%20MixSingh.mp3",
            "duration": 210
        },
        {
            "id": 5,
            "title": "Long time no see",
            "artist": "Taimour Baig, Raffey Anwar, AUR",
            "cover": "https://github.com/shm0210/music-player-assets/raw/fbb717c4ef835be38bd6ad11b28162968d39b591/Long%20time%20no%20see%20-%20Taimour%20Baig_%20Raffey%20Anwar_%20AUR.jpg",
            "source": "https://github.com/shm0210/music-player-assets/raw/fbb717c4ef835be38bd6ad11b28162968d39b591/Long%20time%20no%20see%20-%20Taimour%20Baig_%20Raffey%20Anwar_%20AUR.mp3",
            "duration": 210
        },
        {
  "id": 6,
  "title": "Aadi Anant Shiva",
  "artist": "Aditya Sharma",
  "cover": "https://github.com/shm0210/music-player-assets/raw/74c274681673424c1dd3137a7a7d75af9d27c39c/Aadi%20Anant%20Shiva%20-%20Aditya%20Sharma.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/74c274681673424c1dd3137a7a7d75af9d27c39c/Aadi%20Anant%20Shiva%20-%20Aditya%20Sharma.mp3",
  "duration": 210
},
{
  "id": 7,
  "title": "Bajrang Baan-Lofi",
  "artist": "Rasraj Ji Maharaj",
  "cover": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Bajrang%20Baan-Lofi%20-%20Rasraj%20Ji%20Maharaj.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Bajrang%20Baan-Lofi%20-%20Rasraj%20Ji%20Maharaj.mp3",
  "duration": 210
},
{
  "id": 8,
  "title": "Bhole Charaniy Aaradhna",
  "artist": "Muktidan Gadhvi",
  "cover": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Bhole%20Charaniy%20Aaradhna%20-%20Muktidan%20Gadhvi.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Bhole%20Charaniy%20Aaradhna%20-%20Muktidan%20Gadhvi.mp3",
  "duration": 210
},
{
  "id": 9,
  "title": "Deva Shree Ganesha",
  "artist": "Ajay-Atul / Ajay Gogavale",
  "cover": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Deva%20Shree%20Ganesha%20-%20Ajay-Atul_%20Ajay%20Gogavale.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Deva%20Shree%20Ganesha%20-%20Ajay-Atul_%20Ajay%20Gogavale.mp3",
  "duration": 210
},
{
  "id": 10,
  "title": "Hanuman Chalisa (Lo-fi)",
  "artist": "Rasraj Ji Maharaj",
  "cover": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Hanuman%20Chalisa%20_Lo-fi_%20-%20Rasraj%20Ji%20Maharaj.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/8d63418d0c73a8610e2b7a27ad3e8a971325fdc1/Hanuman%20Chalisa%20_Lo-fi_%20-%20Rasraj%20Ji%20Maharaj.mp3",
  "duration": 210
},
{
  "id": 11,
  "title": "Namami Shamishan",
  "artist": "Religious India",
  "cover": "https://github.com/shm0210/music-player-assets/raw/2500704cf4dc59a636ebb418a4a20c485bea09fb/Namami%20Shamishan%20-%20Religious%20India.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/2500704cf4dc59a636ebb418a4a20c485bea09fb/Namami%20Shamishan%20-%20Religious%20India.mp3",
  "duration": 210
},
{
  "id": 12,
  "title": "Nandi Ki Sawari Naag Angikaar Dhari",
  "artist": "Harindu",
  "cover": "https://github.com/shm0210/music-player-assets/raw/2500704cf4dc59a636ebb418a4a20c485bea09fb/Nandi%20Ki%20Sawari%20Naag%20Angikaar%20Dhari%20-%20Harindu.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/2500704cf4dc59a636ebb418a4a20c485bea09fb/Nandi%20Ki%20Sawari%20Naag%20Angikaar%20Dhari%20-%20Harindu.mp3",
  "duration": 210
},
{
  "id": 13,
  "title": "Nirvana Shatakam",
  "artist": "Religious India",
  "cover": "https://github.com/shm0210/music-player-assets/raw/66e3b8f6998fcc30797536abf7d0516cec4423c5/Nirvana%20Shatakam%20-%20Religious%20India.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/66e3b8f6998fcc30797536abf7d0516cec4423c5/Nirvana%20Shatakam%20-%20Religious%20India.mp3",
  "duration": 210
},
{
  "id": 14,
  "title": "Shiv Kailash (Live in Mumbai)",
  "artist": "Rishab Rikhiram Sharma",
  "cover": "https://github.com/shm0210/music-player-assets/raw/66e3b8f6998fcc30797536abf7d0516cec4423c5/Shiv%20Kailash%20_Live%20in%20Mumbai_%20-%20Rishab%20Rikhiram%20Sharma.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/66e3b8f6998fcc30797536abf7d0516cec4423c5/Shiv%20Kailash%20_Live%20in%20Mumbai_%20-%20Rishab%20Rikhiram%20Sharma.mp3",
  "duration": 210
},
{
  "id": 15,
  "title": "Shiv Panchakshar Stotra",
  "artist": "Religious India",
  "cover": "https://github.com/shm0210/music-player-assets/raw/7b5644797c3433d1f9fd123771989687f4f7b132/Shiv%20Panchakshar%20Stotra%20-%20Religious%20India.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/7b5644797c3433d1f9fd123771989687f4f7b132/Shiv%20Panchakshar%20Stotra%20-%20Religious%20India.mp3",
  "duration": 210
},
{
  "id": 16,
  "title": "Shiv Stuti",
  "artist": "Religious India",
  "cover": "https://github.com/shm0210/music-player-assets/raw/7b5644797c3433d1f9fd123771989687f4f7b132/Shiv%20Stuti%20-%20Religious%20India.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/7b5644797c3433d1f9fd123771989687f4f7b132/Shiv%20Stuti%20-%20Religious%20India.mp3",
  "duration": 210
},
{
  "id": 17,
  "title": "Shiv Tandav Stotram",
  "artist": "Shankar Mahadevan",
  "cover": "https://github.com/shm0210/music-player-assets/raw/f52ec909475129ded814f7df16e7adb44c129fad/Shiv%20Tandav%20Stotram%20-%20Shankar%20Mahadevan.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/f52ec909475129ded814f7df16e7adb44c129fad/Shiv%20Tandav%20Stotram%20-%20Shankar%20Mahadevan.mp3",
  "duration": 210
},
{
  "id": 18,
  "title": "Shree Hari Stotram",
  "artist": "G. Gayathri Devi, Saindhavi, PRIYA, R. Shruti",
  "cover": "https://github.com/shm0210/music-player-assets/raw/f52ec909475129ded814f7df16e7adb44c129fad/Shree%20Hari%20Stotram%20-%20G.%20Gayathri%20Devi_%20Saindhavi_%20PRIYA_%20R.%20Shruti.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/f52ec909475129ded814f7df16e7adb44c129fad/Shree%20Hari%20Stotram%20-%20G.%20Gayathri%20Devi_%20Saindhavi_%20PRIYA_%20R.%20Shruti.mp3",
  "duration": 210
},
{
  "id": 19,
  "title": "Sri Shiv Rudrastkam",
  "artist": "Mrityunjay Hirmeth",
  "cover": "https://github.com/shm0210/music-player-assets/raw/0d6edfb9b5708f8f9e1bc6029fa3245ed7a3086f/Sri%20Shiv%20Rudrastkam%20-%20Mrityunjay%20Hirmeth.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/0d6edfb9b5708f8f9e1bc6029fa3245ed7a3086f/Sri%20Shiv%20Rudrastkam%20-%20Mrityunjay%20Hirmeth.mp3",
  "duration": 210
},
{
  "id": 20,
  "title": "लिङ्गाष्टकम्",
  "artist": "Harindu",
  "cover": "https://github.com/shm0210/music-player-assets/raw/0d6edfb9b5708f8f9e1bc6029fa3245ed7a3086f/%E0%A4%B2_%E0%A4%99_%E0%A4%97_%E0%A4%B7_%E0%A4%9F%E0%A4%95%E0%A4%AE_%20-%20Harindu.jpg",
  "source": "https://github.com/shm0210/music-player-assets/raw/0d6edfb9b5708f8f9e1bc6029fa3245ed7a3086f/%E0%A4%B2_%E0%A4%99_%E0%A4%97_%E0%A4%B7_%E0%A4%9F%E0%A4%95%E0%A4%AE_%20-%20Harindu.mp3",
  "duration": 210
}
        ];
    }
}

// Create default playlists
function createDefaultPlaylists() {
    playlists = [
        {
            id: 1,
            name: "Favorites",
            cover: "https://mosaic.scdn.co/640/ab67616d00001e024c375a25c4afc9c754061da6ab67616d00001e0275a0429b40af0e83780b58e3ab67616d00001e02f332a3bc2f19abf7de632042ab67616d00001e02fc8c4535825cdc0bcafde19a",
            songs: [1, 2, 3, 4, 5]
        },
        {
            id: 2,
            name: "Spritual",
            cover: "https://mosaic.scdn.co/640/ab67616d00001e021592fefed668233b3d38fa0eab67616d00001e023874cc361eca103f5dd69286ab67616d00001e02759b1cd31a392ad7a5fb1e9aab67616d00001e02790d4c884ca491d8562156a2",
            songs: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        },
        {
            id: 3,
            name: "Chill Vibes",
            cover: "https://mosaic.scdn.co/640/ab67616d00001e024c375a25c4afc9c754061da6ab67616d00001e0275a0429b40af0e83780b58e3ab67616d00001e02f332a3bc2f19abf7de632042ab67616d00001e02fc8c4535825cdc0bcafde19a",
            songs: [2]
        },
        {
            id: 4,
            name: "Road Trip",
            cover: "https://mosaic.scdn.co/640/ab67616d00001e024c375a25c4afc9c754061da6ab67616d00001e0275a0429b40af0e83780b58e3ab67616d00001e02f332a3bc2f19abf7de632042ab67616d00001e02fc8c4535825cdc0bcafde19a",
            songs: [1, 2]
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageId = button.getAttribute('data-page');
            switchPage(pageId);
            
            // Update active state of nav buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Now playing bar toggle
    nowPlayingBtn.addEventListener('click', () => {
        nowPlayingBar.classList.toggle('show');
    });
    
    // Audio player events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
    
    // Player controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    // Progress bar click
    progressBar.addEventListener('click', setProgress);
    
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchBtn.addEventListener('click', handleSearch);
}

// Switch between pages
function switchPage(pageId) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageId.split('-')[0]].classList.add('active');
    
    // Scroll to top when switching pages
    window.scrollTo(0, 0);
}

// Toggle theme between dark/light
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('light-mode');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', isDarkMode);
}

// Load theme preference from localStorage
function loadThemePreference() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
        isDarkMode = savedMode === 'true';
        if (!isDarkMode) {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

// Render all songs in home page
function renderAllSongs() {
    allSongsContainer.innerHTML = '';
    
    songs.forEach((song, index) => {
        const songEl = document.createElement('div');
        songEl.className = `song-card ${index === currentSongIndex && isPlaying ? 'playing' : ''}`;
        songEl.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover" loading="lazy">
            <div class="song-info">
                <h4 class="song-title">${song.title}</h4>
                <p class="song-artist">${song.artist}</p>
            </div>
            <button class="song-play-btn" data-id="${song.id}">
                <i class="fas ${index === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
            </button>
        `;
        allSongsContainer.appendChild(songEl);
        
        // Add click event to play/pause song
        songEl.querySelector('.song-play-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (index === currentSongIndex && isPlaying) {
                togglePlay();
            } else {
                playSong(index);
            }
        });
        
        songEl.addEventListener('click', () => {
            // Optional: Add to queue or show song details
        });
    });
}

// Render playlists
function renderPlaylists() {
    playlistsContainer.innerHTML = '';
    
    playlists.forEach(playlist => {
        const playlistEl = document.createElement('div');
        playlistEl.className = 'playlist-card';
        playlistEl.innerHTML = `
            <img src="${playlist.cover}" alt="${playlist.name}" class="playlist-cover" loading="lazy">
            <div class="playlist-info">
                <h4 class="playlist-name">${playlist.name}</h4>
                <p class="playlist-song-count">${playlist.songs.length} songs</p>
                <button class="playlist-play-btn" data-id="${playlist.id}">
                    <i class="fas fa-play"></i> Play All
                </button>
            </div>
        `;
        playlistsContainer.appendChild(playlistEl);
        
        // Add click event to view playlist songs
        playlistEl.addEventListener('click', (e) => {
            if (!e.target.closest('.playlist-play-btn')) {
                viewPlaylistSongs(playlist.id);
            }
        });
        
        // Add click event to play all songs in playlist
        playlistEl.querySelector('.playlist-play-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            playPlaylist(playlist.id);
        });
    });
}

// Play all songs in a playlist
function playPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist || playlist.songs.length === 0) return;
    
    // Find the index of the first song in the playlist
    const firstSongId = playlist.songs[0];
    const firstSongIndex = songs.findIndex(s => s.id === firstSongId);
    
    if (firstSongIndex !== -1) {
        currentPlaylist = playlist;
        playSong(firstSongIndex);
    }
}

// View songs in a playlist
function viewPlaylistSongs(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    currentPlaylist = playlist;
    
    // Hide playlists and show songs container
    playlistsContainer.style.display = 'none';
    playlistSongsContainer.style.display = 'block';
    playlistSongsContainer.innerHTML = `
        <div class="back-to-playlists">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Playlists</span>
        </div>
        <h3>${playlist.name}</h3>
        <div class="songs-container" id="current-playlist-songs"></div>
    `;
    
    // Add back button event
    playlistSongsContainer.querySelector('.back-to-playlists').addEventListener('click', () => {
        playlistsContainer.style.display = 'grid';
        playlistSongsContainer.style.display = 'none';
    });
    
    // Render playlist songs
    const playlistSongsContainerInner = document.getElementById('current-playlist-songs');
    playlistSongsContainerInner.innerHTML = '';
    
    playlist.songs.forEach(songId => {
        const songIndex = songs.findIndex(s => s.id === songId);
        if (songIndex === -1) return;
        const song = songs[songIndex];
        
        const songEl = document.createElement('div');
        songEl.className = `song-card ${songIndex === currentSongIndex && isPlaying ? 'playing' : ''}`;
        songEl.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover" loading="lazy">
            <div class="song-info">
                <h4 class="song-title">${song.title}</h4>
                <p class="song-artist">${song.artist}</p>
            </div>
            <button class="song-play-btn" data-id="${song.id}">
                <i class="fas ${songIndex === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
            </button>
        `;
        playlistSongsContainerInner.appendChild(songEl);
        
        // Add click event to play/pause song
        songEl.querySelector('.song-play-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (songIndex === currentSongIndex && isPlaying) {
                togglePlay();
            } else {
                playSong(songIndex);
            }
        });
    });
}

// Handle search functionality
function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        searchResults.innerHTML = '<p class="no-results">Start typing to search for songs</p>';
        return;
    }
    
    const results = songs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No songs found. Try a different search term.</p>';
        return;
    }
    
    searchResults.innerHTML = `
        <h4>Search Results (${results.length})</h4>
        <div class="songs-container" id="search-songs"></div>
    `;
    
    const searchSongsContainer = document.getElementById('search-songs');
    results.forEach((song, index) => {
        const songEl = document.createElement('div');
        songEl.className = `song-card ${index === currentSongIndex && isPlaying ? 'playing' : ''}`;
        songEl.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover" loading="lazy">
            <div class="song-info">
                <h4 class="song-title">${song.title}</h4>
                <p class="song-artist">${song.artist}</p>
            </div>
            <button class="song-play-btn" data-id="${song.id}">
                <i class="fas ${index === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
            </button>
        `;
        searchSongsContainer.appendChild(songEl);
        
        // Add click event to play/pause song
        songEl.querySelector('.song-play-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const songIndex = songs.findIndex(s => s.id === song.id);
            if (songIndex === currentSongIndex && isPlaying) {
                togglePlay();
            } else {
                playSong(songIndex);
            }
        });
    });
}

// Play a song by index
function playSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    // If same song is playing, just toggle play/pause
    if (index === currentSongIndex && isPlaying) {
        togglePlay();
        return;
    }
    
    currentSongIndex = index;
    const song = songs[currentSongIndex];
    
    audioPlayer.src = song.source;
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updateNowPlayingInfo();
            updatePlayButton();
            updatePlayingStates();
            nowPlayingBar.classList.add('show');
        })
        .catch(error => {
            console.error('Error playing song:', error);
            showError("Couldn't play song. Click the play button to start playback.");
        });
}

// Update all playing states (UI indicators)
function updatePlayingStates() {
    // Update all song cards
    document.querySelectorAll('.song-card').forEach(card => {
        card.classList.remove('playing');
    });
    
    // Update current song card
    const currentSongCards = document.querySelectorAll(`.song-card button[data-id="${songs[currentSongIndex].id}"]`);
    currentSongCards.forEach(btn => {
        const card = btn.closest('.song-card');
        if (card) {
            card.classList.toggle('playing', isPlaying);
            btn.innerHTML = `<i class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>`;
        }
    });
}

// Toggle play/pause
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                updatePlayButton();
                updatePlayingStates();
            })
            .catch(error => {
                console.error('Error playing song:', error);
                showError("Couldn't play song. Please try again.");
            });
    } else {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayButton();
        updatePlayingStates();
    }
}

// Play next song
function nextSong() {
    if (currentPlaylist) {
        // Find next song in current playlist
        const currentSongId = songs[currentSongIndex].id;
        const currentIndexInPlaylist = currentPlaylist.songs.indexOf(currentSongId);
        if (currentIndexInPlaylist !== -1 && currentIndexInPlaylist < currentPlaylist.songs.length - 1) {
            const nextSongId = currentPlaylist.songs[currentIndexInPlaylist + 1];
            const nextSongIndex = songs.findIndex(s => s.id === nextSongId);
            if (nextSongIndex !== -1) {
                playSong(nextSongIndex);
                return;
            }
        }
    }
    
    // Default to next song in all songs
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

// Play previous song
function prevSong() {
    if (currentPlaylist) {
        // Find previous song in current playlist
        const currentSongId = songs[currentSongIndex].id;
        const currentIndexInPlaylist = currentPlaylist.songs.indexOf(currentSongId);
        if (currentIndexInPlaylist > 0) {
            const prevSongId = currentPlaylist.songs[currentIndexInPlaylist - 1];
            const prevSongIndex = songs.findIndex(s => s.id === prevSongId);
            if (prevSongIndex !== -1) {
                playSong(prevSongIndex);
                return;
            }
        }
    }
    
    // Default to previous song in all songs
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
}

// Update progress bar
function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update time display
    currentTimeEl.textContent = formatTime(currentTime);
}

// Set progress bar on click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Update duration display
function updateDuration() {
    durationEl.textContent = formatTime(audioPlayer.duration);
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update now playing info
function updateNowPlayingInfo() {
    const song = songs[currentSongIndex];
    nowPlayingTitle.textContent = song.title;
    nowPlayingArtist.textContent = song.artist;
    nowPlayingCover.src = song.cover;
}

// Update play button icon
function updatePlayButton() {
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

// Update profile stats
function updateProfileStats() {
    totalSongsEl.textContent = songs.length;
    totalPlaylistsEl.textContent = playlists.length;
    
    // Calculate total duration in hours
    const totalMinutes = songs.reduce((sum, song) => sum + (song.duration || 180), 0) / 60;
    totalHoursEl.textContent = Math.round(totalMinutes / 60);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
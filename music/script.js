// Updated script.js with all enhancements
const songs = [
    // ... (keep the existing songs array, same as before)
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
const progressBar = document.getElementById('progressBar');
const currentTimeElement = document.getElementById('currentTime');
const durationElement = document.getElementById('duration');
const volumeSlider = document.getElementById('volumeSlider');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const themeToggle = document.querySelector('.theme-toggle');
const favoritesList = document.getElementById('favoritesList');
const playlistContainer = document.getElementById('playlistContainer');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const playlistModal = document.getElementById('playlistModal');
const closeModal = document.querySelector('.close-modal');
const playlistNameInput = document.getElementById('playlistNameInput');
const modalSongList = document.getElementById('modalSongList');
const savePlaylistBtn = document.getElementById('savePlaylistBtn');
const totalSongsElement = document.getElementById('totalSongs');
const totalPlaylistsElement = document.getElementById('totalPlaylists');

// App State
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let isRepeated = false;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
let shuffledPlaylist = [];

// Initialize the app
function init() {
    renderSongList();
    renderFavorites();
    renderPlaylists();
    setupEventListeners();
    updateStats();
    
    // Set initial volume
    audioPlayer.volume = volumeSlider.value;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Render song list
function renderSongList() {
    songListElement.innerHTML = '';
    songs.forEach((song, index) => {
        const isFavorite = favorites.includes(song.id);
        const songItem = document.createElement('div');
        songItem.className = `song-item ${currentSongIndex === index && isPlaying ? 'playing' : ''}`;
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-info">
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-actions">
                <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-id="${song.id}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="play-btn" data-index="${index}" title="Play">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        songListElement.appendChild(songItem);
    });
}

// Render favorites list
function renderFavorites() {
    favoritesList.innerHTML = '';
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p>No favorite songs yet</p>';
        return;
    }
    
    favorites.forEach(favId => {
        const song = songs.find(s => s.id === favId);
        if (song) {
            const index = songs.findIndex(s => s.id === favId);
            const songItem = document.createElement('div');
            songItem.className = `song-item ${currentSongIndex === index && isPlaying ? 'playing' : ''}`;
            songItem.innerHTML = `
                <img src="${song.cover}" alt="${song.title}" class="song-cover">
                <div class="song-info">
                    <div class="song-name">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <button class="play-btn" data-index="${index}" title="Play">
                    <i class="fas fa-play"></i>
                </button>
            `;
            favoritesList.appendChild(songItem);
        }
    });
}

// Render playlists
function renderPlaylists() {
    playlistContainer.innerHTML = '';
    if (playlists.length === 0) {
        playlistContainer.innerHTML = '<p>No playlists yet</p>';
        return;
    }
    
    playlists.forEach(playlist => {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'playlist-card';
        playlistCard.innerHTML = `
            <img src="${playlist.cover || 'https://github.com/shm0210/music-player-assets/raw/main/default-playlist.jpg'}" alt="${playlist.name}" class="playlist-cover">
            <div class="playlist-info">
                <div class="playlist-name">${playlist.name}</div>
                <div class="playlist-count">${playlist.songs.length} songs</div>
                <button class="playlist-play" data-id="${playlist.id}">Play All</button>
            </div>
        `;
        playlistContainer.appendChild(playlistCard);
    });
    
    // Update playlist count
    totalPlaylistsElement.textContent = playlists.length;
}

// Update statistics
function updateStats() {
    totalSongsElement.textContent = songs.length;
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
        
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            const songId = parseInt(favoriteBtn.getAttribute('data-id'));
            toggleFavorite(songId);
        }
    });
    
    // Play song from favorites
    favoritesList.addEventListener('click', (e) => {
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
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    // Progress bar
    progressBar.addEventListener('input', seekAudio);
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);

    // Volume control
    volumeSlider.addEventListener('input', updateVolume);

    // When song ends
    audioPlayer.addEventListener('ended', handleSongEnd);
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Playlist buttons
    playlistContainer.addEventListener('click', (e) => {
        const playBtn = e.target.closest('.playlist-play');
        if (playBtn) {
            const playlistId = playBtn.getAttribute('data-id');
            playPlaylist(playlistId);
        }
    });
    
    // Create playlist modal
    createPlaylistBtn.addEventListener('click', openPlaylistModal);
    closeModal.addEventListener('click', closePlaylistModal);
    savePlaylistBtn.addEventListener('click', savePlaylist);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === playlistModal) {
            closePlaylistModal();
        }
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
        const songIndex = songs.findIndex(s => s.id === song.id);
        const isFavorite = favorites.includes(song.id);
        const songItem = document.createElement('div');
        songItem.className = `song-item ${currentSongIndex === songIndex && isPlaying ? 'playing' : ''}`;
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-info">
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="song-actions">
                <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-id="${song.id}" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="play-btn" data-index="${songIndex}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `;
        searchResultsElement.appendChild(songItem);
    });
}

// Play a song
function playSong(index) {
    if (index >= 0 && index < songs.length) {
        currentSongIndex = index;
        const song = isShuffled && shuffledPlaylist.length > 0 ? 
            songs.find(s => s.id === shuffledPlaylist[currentSongIndex]) : 
            songs[currentSongIndex];
        
        // Check if song is available
        if (!song.audio || song.audio === '#') {
            showNotification('This song is currently unavailable');
            return;
        }
        
        // Update player UI
        playerCover.src = song.cover;
        playerSong.textContent = song.title;
        playerArtist.textContent = song.artist;
        
        // Set audio source and play
        audioPlayer.src = song.audio;
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playerElement.classList.add('playing');
                updatePlayPauseButton();
                highlightCurrentSong();
            })
            .catch(error => {
                console.error('Error playing song:', error);
                showNotification('Error playing song');
            });
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (audioPlayer.src) {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play()
                .catch(error => {
                    console.error('Error playing song:', error);
                    showNotification('Error playing song');
                });
        }
        isPlaying = !isPlaying;
        playerElement.classList.toggle('playing', isPlaying);
        updatePlayPauseButton();
        highlightCurrentSong();
    }
}

// Play previous song
function playPreviousSong() {
    if (isShuffled && shuffledPlaylist.length > 0) {
        currentSongIndex = (currentSongIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length;
        const songId = shuffledPlaylist[currentSongIndex];
        const index = songs.findIndex(s => s.id === songId);
        playSong(index);
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong(currentSongIndex);
    }
}

// Play next song
function playNextSong() {
    if (isShuffled && shuffledPlaylist.length > 0) {
        currentSongIndex = (currentSongIndex + 1) % shuffledPlaylist.length;
        const songId = shuffledPlaylist[currentSongIndex];
        const index = songs.findIndex(s => s.id === songId);
        playSong(index);
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong(currentSongIndex);
    }
}

// Handle song end
function handleSongEnd() {
    if (isRepeated) {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNextSong();
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
    
    if (isShuffled) {
        // Create a shuffled playlist (array of song IDs)
        shuffledPlaylist = [...songs]
            .filter(song => song.audio && song.audio !== '#')
            .map(song => song.id)
            .sort(() => Math.random() - 0.5);
        
        // Find current song in shuffled playlist
        const currentSongId = songs[currentSongIndex].id;
        const newIndex = shuffledPlaylist.findIndex(id => id === currentSongId);
        if (newIndex !== -1) {
            currentSongIndex = newIndex;
        }
        
        showNotification('Shuffle mode on');
    } else {
        // Find current song in original playlist
        const currentSongId = shuffledPlaylist.length > 0 ? 
            shuffledPlaylist[currentSongIndex] : 
            songs[currentSongIndex].id;
        const newIndex = songs.findIndex(song => song.id === currentSongId);
        if (newIndex !== -1) {
            currentSongIndex = newIndex;
        }
        
        showNotification('Shuffle mode off');
    }
}

// Toggle repeat
function toggleRepeat() {
    isRepeated = !isRepeated;
    repeatBtn.classList.toggle('active', isRepeated);
    showNotification(isRepeated ? 'Repeat mode on' : 'Repeat mode off');
}

// Update progress bar
function updateProgressBar() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration || 1; // Avoid division by zero
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent;
    
    // Update current time display
    currentTimeElement.textContent = formatTime(currentTime);
}

// Update duration display
function updateDuration() {
    const duration = audioPlayer.duration;
    if (!isNaN(duration)) {
        durationElement.textContent = formatTime(duration);
    }
}

// Seek audio
function seekAudio() {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update volume
function updateVolume() {
    audioPlayer.volume = volumeSlider.value;
}

// Update play/pause button icon
function updatePlayPauseButton() {
    const icon = isPlaying ? 'fa-pause' : 'fa-play';
    playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
}

// Highlight current playing song
function highlightCurrentSong() {
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        if (index === currentSongIndex && isPlaying) {
            item.classList.add('playing');
        } else {
            item.classList.remove('playing');
        }
    });
}

// Toggle favorite status
function toggleFavorite(songId) {
    const index = favorites.indexOf(songId);
    if (index === -1) {
        favorites.push(songId);
    } else {
        favorites.splice(index, 1);
    }
    
    // Save to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update UI
    renderSongList();
    renderFavorites();
    
    // Update favorite button in search results if visible
    const searchFavoriteBtns = document.querySelectorAll('#searchResults .favorite-btn');
    searchFavoriteBtns.forEach(btn => {
        if (parseInt(btn.getAttribute('data-id')) === songId) {
            btn.classList.toggle('favorited');
            btn.setAttribute('title', btn.classList.contains('favorited') ? 'Remove from favorites' : 'Add to favorites');
        }
    });
    
    showNotification(index === -1 ? 'Added to favorites' : 'Removed from favorites');
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Open playlist modal
function openPlaylistModal() {
    playlistModal.style.display = 'flex';
    modalSongList.innerHTML = '';
    
    // Add songs to modal
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item';
        songItem.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="song-cover">
            <div class="song-info">
                <div class="song-name">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <input type="checkbox" class="song-checkbox" data-index="${index}">
        `;
        modalSongList.appendChild(songItem);
    });
}

// Close playlist modal
function closePlaylistModal() {
    playlistModal.style.display = 'none';
    playlistNameInput.value = '';
}

// Save new playlist
function savePlaylist() {
    const name = playlistNameInput.value.trim();
    if (!name) {
        showNotification('Please enter a playlist name');
        return;
    }
    
    // Get selected songs
    const checkboxes = document.querySelectorAll('.song-checkbox:checked');
    if (checkboxes.length === 0) {
        showNotification('Please select at least one song');
        return;
    }
    
    const selectedSongs = Array.from(checkboxes).map(checkbox => {
        const index = parseInt(checkbox.getAttribute('data-index'));
        return songs[index].id;
    });
    
    // Create new playlist
    const newPlaylist = {
        id: Date.now(), // Simple unique ID
        name,
        songs: selectedSongs,
        cover: selectedSongs.length > 0 ? songs.find(s => s.id === selectedSongs[0]).cover : 'https://github.com/shm0210/music-player-assets/raw/main/default-playlist.jpg'
    };
    
    playlists.push(newPlaylist);
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
    // Update UI
    renderPlaylists();
    closePlaylistModal();
    showNotification('Playlist created successfully');
}

// Play playlist
function playPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id.toString() === playlistId);
    if (!playlist) return;
    
    // Create a playlist with only available songs
    const availableSongs = playlist.songs
        .map(id => songs.find(s => s.id === id))
        .filter(song => song && song.audio && song.audio !== '#');
    
    if (availableSongs.length === 0) {
        showNotification('No available songs in this playlist');
        return;
    }
    
    // Play first song in playlist
    const firstSongId = availableSongs[0].id;
    const index = songs.findIndex(s => s.id === firstSongId);
    playSong(index);
    
    // Set up shuffled playlist if shuffle is on
    if (isShuffled) {
        shuffledPlaylist = availableSongs.map(song => song.id)
            .sort(() => Math.random() - 0.5);
        currentSongIndex = shuffledPlaylist.findIndex(id => id === firstSongId);
    }
    
    showNotification(`Playing playlist: ${playlist.name}`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

// Initialize the app
init();
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const pageContent = document.getElementById('page-content');
    const bottomNavItems = document.querySelectorAll('.nav-item');
    const miniPlayer = document.querySelector('.mini-player');
    const miniAlbumArt = document.getElementById('mini-album-art');
    const miniSongTitle = document.getElementById('mini-song-title');
    const miniSongArtist = document.getElementById('mini-song-artist');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const miniPrevBtn = document.getElementById('mini-prev-btn');
    const miniNextBtn = document.getElementById('mini-next-btn');
    const miniProgress = document.getElementById('mini-progress');
    const themeToggle = document.getElementById('theme-toggle');

    // Templates
    const homePageTemplate = document.getElementById('home-page');
    const searchPageTemplate = document.getElementById('search-page');
    const playlistsPageTemplate = document.getElementById('playlists-page');
    const profilePageTemplate = document.getElementById('profile-page');
    const playlistSongsTemplate = document.getElementById('playlist-songs-template');

    // App State
    let songs = [];
    let playlists = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let currentPage = 'home';

    // Initialize the player
    function initPlayer() {
        fetch('playlist.json')
            .then(response => response.json())
            .then(data => {
                playlists = data.playlists || [];
                songs = getAllSongsFromPlaylists(playlists);
                renderPage(currentPage);
                updateProfileStats();
            })
            .catch(error => {
                console.error('Error loading playlist:', error);
                playlists = getDefaultPlaylists();
                songs = getAllSongsFromPlaylists(playlists);
                renderPage(currentPage);
                updateProfileStats();
            });

        // Load dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Toggle Light Mode';
        }
    }

    // Get all songs from all playlists
    function getAllSongsFromPlaylists(playlists) {
        let allSongs = [];
        playlists.forEach(playlist => {
            allSongs = allSongs.concat(playlist.songs);
        });
        return allSongs;
    }

    // Default playlists if playlist.json fails to load
    function getDefaultPlaylists() {
        return [
            {
                name: "Favorites",
                cover: "https://via.placeholder.com/300/6c5ce7/ffffff?text=Favorites",
                songs: [
                    {
                        title: "Blinding Lights",
                        artist: "The Weeknd",
                        album: "After Hours",
                        duration: "3:20",
                        file: "music/the-weeknd-blinding-lights.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
                    },
                    {
                        title: "Save Your Tears",
                        artist: "The Weeknd",
                        album: "After Hours",
                        duration: "3:35",
                        file: "music/the-weeknd-save-your-tears.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
                    }
                ]
            },
            {
                name: "Workout Mix",
                cover: "https://via.placeholder.com/300/6c5ce7/ffffff?text=Workout",
                songs: [
                    {
                        title: "Levitating",
                        artist: "Dua Lipa",
                        album: "Future Nostalgia",
                        duration: "3:23",
                        file: "music/dua-lipa-levitating.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b273a935e468a89e2e75b8b310c1"
                    },
                    {
                        title: "Don't Start Now",
                        artist: "Dua Lipa",
                        album: "Future Nostalgia",
                        duration: "3:03",
                        file: "music/dua-lipa-dont-start-now.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b273a935e468a89e2e75b8b310c1"
                    }
                ]
            }
        ];
    }

    // Render the current page
    function renderPage(page) {
        currentPage = page;
        pageContent.innerHTML = '';

        switch (page) {
            case 'home':
                renderHomePage();
                break;
            case 'search':
                renderSearchPage();
                break;
            case 'playlists':
                renderPlaylistsPage();
                break;
            case 'profile':
                renderProfilePage();
                break;
            default:
                renderHomePage();
        }

        // Update active nav item
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
    }

    // Render home page with all songs
    function renderHomePage() {
        const homePage = homePageTemplate.content.cloneNode(true);
        const songsGrid = homePage.querySelector('#songs-grid');
        
        songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <div class="song-cover">
                    <img src="${song.cover || 'https://via.placeholder.com/50'}" alt="${song.title}">
                </div>
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <button class="song-play-btn" data-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
            `;
            songsGrid.appendChild(songCard);
        });

        // Add event listeners to play buttons
        songsGrid.querySelectorAll('.song-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                playSongAtIndex(index);
            });
        });

        // Add event listener to song cards
        songsGrid.querySelectorAll('.song-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                // You could add a detail view here if needed
            });
        });

        pageContent.appendChild(homePage);
    }

    // Render search page
    function renderSearchPage() {
        const searchPage = searchPageTemplate.content.cloneNode(true);
        const searchInput = searchPage.querySelector('#search-input');
        const searchResults = searchPage.querySelector('#search-results');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filteredSongs = songs.filter(song => 
                song.title.toLowerCase().includes(query) || 
                song.artist.toLowerCase().includes(query) ||
                song.album.toLowerCase().includes(query)
            );
            
            searchResults.innerHTML = '';
            filteredSongs.forEach((song, index) => {
                const songCard = document.createElement('div');
                songCard.className = 'song-card';
                songCard.innerHTML = `
                    <div class="song-cover">
                        <img src="${song.cover || 'https://via.placeholder.com/50'}" alt="${song.title}">
                    </div>
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist}</div>
                    </div>
                    <button class="song-play-btn" data-index="${index}">
                        <i class="fas fa-play"></i>
                    </button>
                `;
                searchResults.appendChild(songCard);
            });

            // Add event listeners to play buttons
            searchResults.querySelectorAll('.song-play-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const index = parseInt(btn.dataset.index);
                    playSongAtIndex(index);
                });
            });
        });

        pageContent.appendChild(searchPage);
    }

    // Render playlists page
    function renderPlaylistsPage() {
        const playlistsPage = playlistsPageTemplate.content.cloneNode(true);
        const playlistsGrid = playlistsPage.querySelector('#playlists-grid');
        
        playlists.forEach((playlist, index) => {
            const playlistCard = document.createElement('div');
            playlistCard.className = 'playlist-card';
            playlistCard.innerHTML = `
                <div class="playlist-cover">
                    <img src="${playlist.cover || 'https://via.placeholder.com/300'}" alt="${playlist.name}">
                    <div class="playlist-info">
                        <div class="playlist-name">${playlist.name}</div>
                        <div class="playlist-song-count">${playlist.songs.length} songs</div>
                    </div>
                    <button class="playlist-play-btn" data-index="${index}">
                        <i class="fas fa-play"></i>
                    </button>
                </div>
            `;
            playlistsGrid.appendChild(playlistCard);
        });

        // Add event listeners to playlist cards
        playlistsGrid.querySelectorAll('.playlist-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                renderPlaylistSongsPage(index);
            });
        });

        // Add event listeners to play buttons
        playlistsGrid.querySelectorAll('.playlist-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const playlistIndex = parseInt(btn.dataset.index);
                playPlaylist(playlistIndex);
            });
        });

        pageContent.appendChild(playlistsPage);
    }

    // Render playlist songs page
    function renderPlaylistSongsPage(playlistIndex) {
        const playlist = playlists[playlistIndex];
        const playlistSongsPage = playlistSongsTemplate.content.cloneNode(true);
        
        // Set playlist info
        playlistSongsPage.querySelector('#playlist-cover-img').src = playlist.cover || 'https://via.placeholder.com/150';
        playlistSongsPage.querySelector('#playlist-name').textContent = playlist.name;
        playlistSongsPage.querySelector('#playlist-song-count').textContent = `${playlist.songs.length} songs`;
        
        // Add back button functionality
        const backBtn = document.createElement('button');
        backBtn.className = 'btn back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Playlists';
        backBtn.addEventListener('click', () => {
            renderPage('playlists');
        });
        playlistSongsPage.querySelector('.playlist-header').prepend(backBtn);
        
        // Add songs to playlist
        const playlistSongsList = playlistSongsPage.querySelector('#playlist-songs-list');
        playlist.songs.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'song-card';
            songCard.innerHTML = `
                <div class="song-cover">
                    <img src="${song.cover || 'https://via.placeholder.com/50'}" alt="${song.title}">
                </div>
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <button class="song-play-btn" data-playlist="${playlistIndex}" data-index="${index}">
                    <i class="fas fa-play"></i>
                </button>
            `;
            playlistSongsList.appendChild(songCard);
        });

        // Add event listener to play all button
        playlistSongsPage.querySelector('#play-all-btn').addEventListener('click', () => {
            playPlaylist(playlistIndex);
        });

        // Add event listeners to play buttons
        playlistSongsList.querySelectorAll('.song-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const playlistIndex = parseInt(btn.dataset.playlist);
                const songIndex = parseInt(btn.dataset.index);
                playSongFromPlaylist(playlistIndex, songIndex);
            });
        });

        // Clear page and add new content
        pageContent.innerHTML = '';
        pageContent.appendChild(playlistSongsPage);
    }

    // Render profile page
    function renderProfilePage() {
        const profilePage = profilePageTemplate.content.cloneNode(true);
        pageContent.appendChild(profilePage);
    }

    // Update profile stats
    function updateProfileStats() {
        const totalSongs = songs.length;
        const totalPlaylists = playlists.length;
        const totalMinutes = Math.floor(songs.reduce((acc, song) => {
            const [min, sec] = song.duration.split(':').map(Number);
            return acc + min + sec / 60;
        }, 0));
        
        document.getElementById('total-songs').textContent = totalSongs;
        document.getElementById('total-playlists').textContent = totalPlaylists;
        document.getElementById('total-time').textContent = totalMinutes;
    }

    // Play song at index
    function playSongAtIndex(index) {
        if (index < 0 || index >= songs.length) return;
        
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        audioPlayer.src = song.file;
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                updateMiniPlayer();
                miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            })
            .catch(error => {
                console.error('Playback failed:', error);
            });
    }

    // Play song from specific playlist
    function playSongFromPlaylist(playlistIndex, songIndex) {
        const playlist = playlists[playlistIndex];
        if (!playlist || songIndex < 0 || songIndex >= playlist.songs.length) return;
        
        // Find the song in the main songs array
        const playlistSong = playlist.songs[songIndex];
        const mainIndex = songs.findIndex(s => s.title === playlistSong.title && s.artist === playlistSong.artist);
        
        if (mainIndex !== -1) {
            playSongAtIndex(mainIndex);
        } else {
            // If song not found in main array, play directly from playlist
            currentSongIndex = 0; // Reset as we're playing from playlist
            const song = playlist.songs[songIndex];
            audioPlayer.src = song.file;
            audioPlayer.play()
                .then(() => {
                    isPlaying = true;
                    updateMiniPlayer(song);
                    miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                });
        }
    }

    // Play entire playlist
    function playPlaylist(playlistIndex) {
        const playlist = playlists[playlistIndex];
        if (!playlist || playlist.songs.length === 0) return;
        
        // For simplicity, just play the first song in the playlist
        playSongFromPlaylist(playlistIndex, 0);
    }

    // Update mini player with current song info
    function updateMiniPlayer(song) {
        const currentSong = song || songs[currentSongIndex];
        if (!currentSong) return;
        
        miniAlbumArt.src = currentSong.cover || 'https://via.placeholder.com/50';
        miniSongTitle.textContent = currentSong.title;
        miniSongArtist.textContent = currentSong.artist;
        
        // Show mini player if it's hidden
        if (!miniPlayer.classList.contains('active')) {
            miniPlayer.classList.add('active');
        }
    }

    // Toggle play/pause
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    isPlaying = true;
                    miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                });
        } else {
            audioPlayer.pause();
            isPlaying = false;
            miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // Play next song
    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSongAtIndex(currentSongIndex);
    }

    // Play previous song
    function playPrevSong() {
        if (audioPlayer.currentTime > 3) {
            // If more than 3 seconds into the song, restart it
            audioPlayer.currentTime = 0;
        } else {
            // Otherwise go to previous song
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            playSongAtIndex(currentSongIndex);
        }
    }

    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        miniProgress.style.width = `${progressPercent}%`;
    }

    // Toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? 
            '<i class="fas fa-sun"></i> Toggle Light Mode' : 
            '<i class="fas fa-moon"></i> Toggle Dark Mode';
    }

    // Event Listeners
    // Navigation
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            renderPage(item.dataset.page);
        });
    });

    // Mini Player Controls
    miniPlayBtn.addEventListener('click', togglePlayPause);
    miniPrevBtn.addEventListener('click', playPrevSong);
    miniNextBtn.addEventListener('click', playNextSong);

    // Audio Player Events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', playNextSong);
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    // Theme Toggle
    themeToggle.addEventListener('click', toggleDarkMode);

    // Initialize the player
    initPlayer();
});
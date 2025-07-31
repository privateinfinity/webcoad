export function initUI(player) {
    // DOM Elements
    const pageContent = document.getElementById('page-content');
    const bottomNavItems = document.querySelectorAll('.nav-item');
    const themeToggle = document.getElementById('theme-toggle');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    // Templates
    const homePageTemplate = document.getElementById('home-page');
    const searchPageTemplate = document.getElementById('search-page');
    const playlistsPageTemplate = document.getElementById('playlists-page');
    const profilePageTemplate = document.getElementById('profile-page');
    const playlistSongsTemplate = document.getElementById('playlist-songs-template');

    // App State
    let currentPage = 'home';

    // Initialize UI
    renderPage(currentPage);
    updateProfileStats();
    loadThemePreference();

    // Helper functions
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
        updateActiveNavItem();
    }

    function renderHomePage() {
        const homePage = homePageTemplate.content.cloneNode(true);
        const songsGrid = homePage.querySelector('#songs-grid');
        
        player.songs.forEach((song, index) => {
            const songCard = createSongCard(song, index);
            songsGrid.appendChild(songCard);
        });

        // Add event listeners
        addSongCardEventListeners(songsGrid);
        pageContent.appendChild(homePage);
    }

    function renderSearchPage() {
        const searchPage = searchPageTemplate.content.cloneNode(true);
        const searchInput = searchPage.querySelector('#search-input');
        const searchResults = searchPage.querySelector('#search-results');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            
            if (query.trim() === '') {
                searchResults.innerHTML = '<p class="search-placeholder">Start typing to search for songs</p>';
                return;
            }
            
            const filteredSongs = player.songs.filter(song => {
                const title = song.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const artist = song.artist.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const album = song.album.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                
                return title.includes(query) || 
                       artist.includes(query) ||
                       album.includes(query);
            });
            
            searchResults.innerHTML = '';
            
            if (filteredSongs.length === 0) {
                searchResults.innerHTML = '<p class="search-placeholder">No results found</p>';
                return;
            }
            
            filteredSongs.forEach((song, index) => {
                const songCard = createSongCard(song, index);
                searchResults.appendChild(songCard);
            });
            
            // Add event listeners
            addSongCardEventListeners(searchResults);
        });

        // Initial placeholder
        searchResults.innerHTML = '<p class="search-placeholder">Start typing to search for songs</p>';
        pageContent.appendChild(searchPage);
    }

    function renderPlaylistsPage() {
        const playlistsPage = playlistsPageTemplate.content.cloneNode(true);
        const playlistsGrid = playlistsPage.querySelector('#playlists-grid');
        
        player.playlists.forEach((playlist, index) => {
            const playlistCard = document.createElement('div');
            playlistCard.className = 'playlist-card';
            playlistCard.innerHTML = `
                <div class="playlist-cover">
                    <img src="${playlist.cover || 'assets/icons/default-playlist.png'}" alt="${playlist.name} cover">
                    <div class="playlist-info">
                        <div class="playlist-name">${playlist.name}</div>
                        <div class="playlist-song-count">${playlist.songs.length} songs</div>
                    </div>
                    <button class="playlist-play-btn" data-index="${index}" aria-label="Play ${playlist.name}">
                        <i class="fas fa-play" aria-hidden="true"></i>
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
                player.currentPlaylist = player.playlists[playlistIndex];
                player.playSongAtIndex(player.songs.findIndex(s => 
                    s.playlistId === player.currentPlaylist.name
                ));
            });
        });

        pageContent.appendChild(playlistsPage);
    }

    function renderPlaylistSongsPage(playlistIndex) {
        const playlist = player.playlists[playlistIndex];
        const playlistSongsPage = playlistSongsTemplate.content.cloneNode(true);
        
        // Set playlist info
        playlistSongsPage.querySelector('#playlist-cover-img').src = playlist.cover || 'assets/icons/default-playlist.png';
        playlistSongsPage.querySelector('#playlist-cover-img').alt = `${playlist.name} cover`;
        playlistSongsPage.querySelector('#playlist-name').textContent = playlist.name;
        playlistSongsPage.querySelector('#playlist-song-count').textContent = `${playlist.songs.length} ${playlist.songs.length === 1 ? 'song' : 'songs'}`;
        
        // Add back button functionality
        playlistSongsPage.querySelector('#back-to-playlists').addEventListener('click', () => {
            renderPage('playlists');
        });
        
        // Add songs to playlist
        const playlistSongsList = playlistSongsPage.querySelector('#playlist-songs-list');
        playlist.songs.forEach((song, index) => {
            const songCard = createSongCard(song, index, playlistIndex);
            playlistSongsList.appendChild(songCard);
        });

        // Add event listener to play all button
        playlistSongsPage.querySelector('#play-all-btn').addEventListener('click', () => {
            player.currentPlaylist = playlist;
            player.playSongAtIndex(player.songs.findIndex(s => 
                s.title === playlist.songs[0].title && s.artist === playlist.songs[0].artist
            ));
        });

        // Add event listener to shuffle button
        playlistSongsPage.querySelector('#shuffle-playlist-btn').addEventListener('click', () => {
            player.toggleShuffle();
        });

        // Clear page and add new content
        pageContent.innerHTML = '';
        pageContent.appendChild(playlistSongsPage);
    }

    function renderProfilePage() {
        const profilePage = profilePageTemplate.content.cloneNode(true);
        pageContent.appendChild(profilePage);
        
        // Add event listeners to profile buttons
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                player.toggleShuffle();
                shuffleBtn.classList.toggle('active', player.isShuffle);
            });
        }
        
        if (repeatBtn) {
            repeatBtn.addEventListener('click', () => {
                player.toggleRepeat();
                repeatBtn.classList.toggle('active', player.isRepeat);
            });
        }
        
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleDarkMode);
        }
    }

    function createSongCard(song, index, playlistIndex = null) {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        if (player.currentSongIndex === index && player.isPlaying) {
            songCard.classList.add('playing');
        }
        songCard.dataset.id = `${song.title}-${song.artist}`;
        
        songCard.innerHTML = `
            <div class="song-cover">
                <img src="${song.cover || 'assets/icons/default-album.png'}" alt="${song.title} album cover">
            </div>
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <button class="song-play-btn" data-index="${index}" ${playlistIndex !== null ? `data-playlist="${playlistIndex}"` : ''} aria-label="Play ${song.title}">
                <i class="fas fa-${player.currentSongIndex === index && player.isPlaying ? 'pause' : 'play'}" aria-hidden="true"></i>
            </button>
        `;
        
        return songCard;
    }

    function addSongCardEventListeners(container) {
        // Add event listeners to play buttons
        container.querySelectorAll('.song-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.dataset.index);
                if (btn.dataset.playlist) {
                    const playlistIndex = parseInt(btn.dataset.playlist);
                    player.currentPlaylist = player.playlists[playlistIndex];
                }
                player.playSongAtIndex(index);
            });
        });

        // Add event listener to song cards
        container.querySelectorAll('.song-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                // You could add a detail view here if needed
            });
        });
    }

    function updateProfileStats() {
        const totalSongs = player.songs.length;
        const totalPlaylists = player.playlists.length;
        const totalMinutes = Math.floor(player.songs.reduce((acc, song) => {
            const [min, sec] = song.duration.split(':').map(Number);
            return acc + min + sec / 60;
        }, 0));
        
        document.getElementById('total-songs').textContent = totalSongs;
        document.getElementById('total-playlists').textContent = totalPlaylists;
        document.getElementById('total-time').textContent = totalMinutes;
    }

    function updateActiveNavItem() {
        bottomNavItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === currentPage) {
                item.classList.add('active');
            }
        });
    }

    function loadThemePreference() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', isDarkMode);
        
        if (themeToggle) {
            themeToggle.innerHTML = isDarkMode ? 
                '<i class="fas fa-sun" aria-hidden="true"></i> Toggle Light Mode' : 
                '<i class="fas fa-moon" aria-hidden="true"></i> Toggle Dark Mode';
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        
        if (themeToggle) {
            themeToggle.innerHTML = isDarkMode ? 
                '<i class="fas fa-sun" aria-hidden="true"></i> Toggle Light Mode' : 
                '<i class="fas fa-moon" aria-hidden="true"></i> Toggle Dark Mode';
        }
    }

    // Event Listeners
    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            renderPage(item.dataset.page);
        });
    });

    // Initialize shuffle and repeat buttons
    if (shuffleBtn) shuffleBtn.classList.toggle('active', player.isShuffle);
    if (repeatBtn) repeatBtn.classList.toggle('active', player.isRepeat);
}
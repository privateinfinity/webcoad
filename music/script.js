document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeBar = document.getElementById('volume-bar');
    const songsList = document.getElementById('songs-list').getElementsByTagName('tbody')[0];
    const currentSongTitle = document.getElementById('current-song-title');
    const currentSongArtist = document.getElementById('current-song-artist');
    const currentSongAlbum = document.getElementById('current-song-album');
    const currentAlbumArt = document.getElementById('current-album-art');
    const themeToggle = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search-input');
    const playlistList = document.getElementById('playlist-list');
    const addPlaylistBtn = document.getElementById('add-playlist');
    const addPlaylistModal = document.getElementById('add-playlist-modal');
    const closeModal = document.querySelector('.close-modal');
    const playlistForm = document.getElementById('playlist-form');

    // App State
    let songs = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let isMuted = false;
    let volumeBeforeMute = 0.8;

    // Initialize the player
    function initPlayer() {
        fetch('playlist.json')
            .then(response => response.json())
            .then(data => {
                songs = data;
                renderSongsList();
                loadSong(0);
                createDefaultPlaylists();
            })
            .catch(error => {
                console.error('Error loading playlist:', error);
                songs = getDefaultSongs();
                renderSongsList();
                loadSong(0);
                createDefaultPlaylists();
            });

        // Set initial volume
        audioPlayer.volume = volumeBar.value / 100;
    }

    // Default songs if playlist.json fails to load
    function getDefaultSongs() {
        return [
            {
                "title": "Blinding Lights",
                "artist": "The Weeknd",
                "album": "After Hours",
                "duration": "3:20",
                "file": "music/the-weeknd-blinding-lights.mp3",
                "cover": "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
            },
            {
                "title": "Save Your Tears",
                "artist": "The Weeknd",
                "album": "After Hours",
                "duration": "3:35",
                "file": "music/the-weeknd-save-your-tears.mp3",
                "cover": "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
            },
            {
                "title": "Levitating",
                "artist": "Dua Lipa",
                "album": "Future Nostalgia",
                "duration": "3:23",
                "file": "music/dua-lipa-levitating.mp3",
                "cover": "https://i.scdn.co/image/ab67616d0000b273a935e468a89e2e75b8b310c1"
            },
            {
                "title": "Don't Start Now",
                "artist": "Dua Lipa",
                "album": "Future Nostalgia",
                "duration": "3:03",
                "file": "music/dua-lipa-dont-start-now.mp3",
                "cover": "https://i.scdn.co/image/ab67616d0000b273a935e468a89e2e75b8b310c1"
            },
            {
                "title": "Watermelon Sugar",
                "artist": "Harry Styles",
                "album": "Fine Line",
                "duration": "2:54",
                "file": "music/harry-styles-watermelon-sugar.mp3",
                "cover": "https://i.scdn.co/image/ab67616d0000b2733a58f9eb9ff6362f2a82997b"
            }
        ];
    }

    // Create default playlists
    function createDefaultPlaylists() {
        const playlists = [
            { name: "Favorites", songs: [] },
            { name: "Recently Played", songs: [] },
            { name: "Workout Mix", songs: [] }
        ];
        
        const storedPlaylists = JSON.parse(localStorage.getItem('playlists')) || [];
        if (storedPlaylists.length === 0) {
            localStorage.setItem('playlists', JSON.stringify(playlists));
        }
        
        renderPlaylists();
    }

    // Render songs list
    function renderSongsList(filter = '') {
        songsList.innerHTML = '';
        
        const filteredSongs = filter ? 
            songs.filter(song => 
                song.title.toLowerCase().includes(filter.toLowerCase()) || 
                song.artist.toLowerCase().includes(filter.toLowerCase()) ||
                song.album.toLowerCase().includes(filter.toLowerCase())
            ) : 
            songs;
        
        filteredSongs.forEach((song, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${song.title}</td>
                <td>${song.artist}</td>
                <td>${song.album}</td>
                <td>${song.duration}</td>
            `;
            row.addEventListener('click', () => {
                currentSongIndex = songs.findIndex(s => s.title === song.title);
                loadSong(currentSongIndex);
                playSong();
            });
            songsList.appendChild(row);
        });
    }

    // Render playlists
    function renderPlaylists() {
        playlistList.innerHTML = '';
        const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        
        playlists.forEach(playlist => {
            const li = document.createElement('li');
            li.textContent = playlist.name;
            li.addEventListener('click', () => {
                // Remove active class from all playlists
                document.querySelectorAll('#playlist-list li').forEach(item => {
                    item.classList.remove('active');
                });
                // Add active class to clicked playlist
                li.classList.add('active');
                // TODO: Load playlist songs
            });
            playlistList.appendChild(li);
        });
    }

    // Load song
    function loadSong(index) {
        if (index < 0 || index >= songs.length) return;
        
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        audioPlayer.src = song.file;
        currentSongTitle.textContent = song.title;
        currentSongArtist.textContent = song.artist;
        currentSongAlbum.textContent = song.album;
        currentAlbumArt.src = song.cover || 'https://via.placeholder.com/300';
        
        // Highlight current song in the list
        const rows = songsList.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            rows[i].classList.remove('playing');
            if (i === currentSongIndex) {
                rows[i].classList.add('playing');
            }
        }
        
        // Play the song if player was playing
        if (isPlaying) {
            playSong();
        }
    }

    // Play song
    function playSong() {
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtn.title = 'Pause';
            })
            .catch(error => {
                console.error('Playback failed:', error);
            });
    }

    // Pause song
    function pauseSong() {
        audioPlayer.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.title = 'Play';
    }

    // Next song
    function nextSong() {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * songs.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // Previous song
    function prevSong() {
        if (audioPlayer.currentTime > 3) {
            // If more than 3 seconds into the song, restart it
            audioPlayer.currentTime = 0;
        } else {
            // Otherwise go to previous song
            if (isShuffle) {
                currentSongIndex = Math.floor(Math.random() * songs.length);
            } else {
                currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            }
            loadSong(currentSongIndex);
            if (isPlaying) {
                playSong();
            }
        }
    }

    // Update progress bar
    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        
        // Format time
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60).toString().padStart(2, '0');
        if (duration) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
    }

    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    // Toggle mute
    function toggleMute() {
        if (isMuted) {
            audioPlayer.volume = volumeBeforeMute;
            volumeBar.value = volumeBeforeMute * 100;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeBtn.title = 'Mute';
        } else {
            volumeBeforeMute = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeBar.value = 0;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeBtn.title = 'Unmute';
        }
        isMuted = !isMuted;
    }

    // Set volume
    function setVolume() {
        audioPlayer.volume = this.value / 100;
        if (audioPlayer.volume === 0) {
            isMuted = true;
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeBtn.title = 'Unmute';
        } else {
            isMuted = false;
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeBtn.title = 'Mute';
        }
    }

    // Toggle shuffle
    function toggleShuffle() {
        isShuffle = !isShuffle;
        document.getElementById('shuffle-btn').classList.toggle('active', isShuffle);
    }

    // Toggle repeat
    function toggleRepeat() {
        isRepeat = !isRepeat;
        audioPlayer.loop = isRepeat;
        document.getElementById('repeat-btn').classList.toggle('active', isRepeat);
    }

    // Toggle dark mode
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.title = isDarkMode ? 'Toggle Light Mode' : 'Toggle Dark Mode';
    }

    // Add new playlist
    function addPlaylist(e) {
        e.preventDefault();
        const playlistName = document.getElementById('playlist-name').value.trim();
        if (!playlistName) return;
        
        const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
        playlists.push({ name: playlistName, songs: [] });
        localStorage.setItem('playlists', JSON.stringify(playlists));
        
        renderPlaylists();
        addPlaylistModal.style.display = 'none';
        playlistForm.reset();
    }

    // Event Listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        if (!isRepeat) {
            nextSong();
        }
    });
    audioPlayer.addEventListener('loadedmetadata', updateProgress);

    progressBar.addEventListener('click', setProgress);
    volumeBar.addEventListener('input', setVolume);
    volumeBtn.addEventListener('click', toggleMute);

    document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
    document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);

    themeToggle.addEventListener('click', toggleDarkMode);

    searchInput.addEventListener('input', (e) => {
        renderSongsList(e.target.value);
    });

    addPlaylistBtn.addEventListener('click', () => {
        addPlaylistModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        addPlaylistModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addPlaylistModal) {
            addPlaylistModal.style.display = 'none';
        }
    });

    playlistForm.addEventListener('submit', addPlaylist);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Toggle Light Mode';
    }

    // Initialize the player
    initPlayer();
});
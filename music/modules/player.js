export function initPlayer(data) {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const miniPlayer = document.querySelector('.mini-player');
    const miniAlbumArt = document.getElementById('mini-album-art');
    const miniSongTitle = document.getElementById('mini-song-title');
    const miniSongArtist = document.getElementById('mini-song-artist');
    const miniPlayBtn = document.getElementById('mini-play-btn');
    const miniPrevBtn = document.getElementById('mini-prev-btn');
    const miniNextBtn = document.getElementById('mini-next-btn');
    const miniProgress = document.getElementById('mini-progress');
    const miniSeek = document.getElementById('mini-seek');
    const miniVolume = document.getElementById('mini-volume');
    const toast = document.getElementById('toast');

    // App State
    let songs = [];
    let playlists = [];
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let currentPlaylist = null;

    // Initialize with provided data
    if (data) {
        playlists = data.playlists || [];
        songs = getAllSongsFromPlaylists(playlists);
    } else {
        playlists = getDefaultPlaylists();
        songs = getAllSongsFromPlaylists(playlists);
    }

    // Helper functions
    function getAllSongsFromPlaylists(playlists) {
        return playlists.reduce((allSongs, playlist) => {
            return allSongs.concat(playlist.songs.map(song => ({
                ...song,
                playlistId: playlist.name
            })));
        }, []);
    }

    function getDefaultPlaylists() {
        return [
            {
                name: "Favorites",
                cover: "assets/icons/default-playlist.png",
                songs: [
                    {
                        title: "Blinding Lights",
                        artist: "The Weeknd",
                        album: "After Hours",
                        duration: "3:20",
                        file: "https://github.com/shm0210/music-player-assets/raw/main/song1.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
                    },
                    {
                        title: "Save Your Tears",
                        artist: "The Weeknd",
                        album: "After Hours",
                        duration: "3:35",
                        file: "https://github.com/shm0210/music-player-assets/raw/main/song1.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36"
                    }
                ]
            },
            {
                name: "Workout Mix",
                cover: "assets/icons/default-playlist.png",
                songs: [
                    {
                        title: "Levitating",
                        artist: "Dua Lipa",
                        album: "Future Nostalgia",
                        duration: "3:23",
                        file: "https://github.com/shm0210/music-player-assets/raw/main/song1.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b273a935e468a89e2e75b8b310c1"
                    },
                    {
                        title: "Don't Start Now",
                        artist: "Dua Lipa",
                        album: "Future Nostalgia",
                        duration: "3:03",
                        file: "https://github.com/shm0210/music-player-assets/raw/main/song1.mp3",
                        cover: "https://i.scdn.co/image/ab67616d0000b273a935e468a89e2e75b8b310c1"
                    }
                ]
            }
        ];
    }

    function showToast(message, duration = 3000) {
        if (!toast) return;
        
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    function updateMiniPlayer(song) {
        const currentSong = song || songs[currentSongIndex];
        if (!currentSong) return;
        
        miniAlbumArt.src = currentSong.cover || 'assets/icons/default-album.png';
        miniAlbumArt.alt = `${currentSong.title} album cover`;
        miniSongTitle.textContent = currentSong.title;
        miniSongArtist.textContent = currentSong.artist;
        
        // Show mini player
        miniPlayer.classList.add('active');
    }

    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play()
                .then(() => {
                    isPlaying = true;
                    miniPlayBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
                    showToast(`Now playing: ${songs[currentSongIndex].title}`);
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    showToast('Failed to play song');
                });
        } else {
            audioPlayer.pause();
            isPlaying = false;
            miniPlayBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
        }
    }

    function playSongAtIndex(index) {
        if (index < 0 || index >= songs.length) return;
        
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        try {
            audioPlayer.src = song.file;
            audioPlayer.currentTime = 0;
            audioPlayer.play()
                .then(() => {
                    isPlaying = true;
                    updateMiniPlayer();
                    miniPlayBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
                    
                    // Update playing state in UI
                    document.querySelectorAll('.song-card').forEach(card => {
                        card.classList.remove('playing');
                    });
                    
                    const currentSongCards = document.querySelectorAll(`.song-card[data-id="${song.title}-${song.artist}"]`);
                    currentSongCards.forEach(card => {
                        card.classList.add('playing');
                        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    });
                    
                    showToast(`Now playing: ${song.title}`);
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                    showToast('Failed to play song');
                });
        } catch (error) {
            console.error('Error playing song:', error);
            showToast('Error playing song');
        }
    }

    function playNextSong() {
        if (isShuffle) {
            currentSongIndex = Math.floor(Math.random() * songs.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
        playSongAtIndex(currentSongIndex);
    }

    function playPrevSong() {
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
            playSongAtIndex(currentSongIndex);
        }
    }

    function updateProgress() {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = duration ? (currentTime / duration) * 100 : 0;
        miniProgress.style.width = `${progressPercent}%`;
        miniSeek.value = progressPercent;
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.classList.toggle('active', isShuffle);
        }
        showToast(isShuffle ? 'Shuffle enabled' : 'Shuffle disabled');
    }

    function toggleRepeat() {
        isRepeat = !isRepeat;
        audioPlayer.loop = isRepeat;
        const repeatBtn = document.getElementById('repeat-btn');
        if (repeatBtn) {
            repeatBtn.classList.toggle('active', isRepeat);
        }
        showToast(isRepeat ? 'Repeat enabled' : 'Repeat disabled');
    }

    // Event Listeners
    miniPlayBtn.addEventListener('click', togglePlayPause);
    miniPrevBtn.addEventListener('click', playPrevSong);
    miniNextBtn.addEventListener('click', playNextSong);

    miniVolume.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value;
    });

    miniSeek.addEventListener('input', (e) => {
        const seekTime = (e.target.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNextSong();
        }
    });
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        miniPlayBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
    });
    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        miniPlayBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
    });
    audioPlayer.addEventListener('error', () => {
        showToast('Error playing song');
    });

    // Initialize volume
    audioPlayer.volume = miniVolume.value;

    // Public API
    return {
        songs,
        playlists,
        currentSongIndex,
        isPlaying,
        isShuffle,
        isRepeat,
        currentPlaylist,
        playSongAtIndex,
        playNextSong,
        playPrevSong,
        togglePlayPause,
        toggleShuffle,
        toggleRepeat,
        showToast,
        updateMiniPlayer,
        getAllSongsFromPlaylists,
        getDefaultPlaylists
    };
}
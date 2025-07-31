export async function loadData() {
    try {
        const response = await fetch('playlist.json');
        if (!response.ok) {
            throw new Error('Failed to load playlist data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading playlist data:', error);
        return {
            playlists: [
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
            ]
        };
    }
}
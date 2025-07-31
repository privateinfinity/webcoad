import { initPlayer } from './modules/player.js';
import { initUI } from './modules/ui.js';
import { loadData } from './modules/data.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize the application
        const data = await loadData();
        const player = initPlayer(data);
        initUI(player);
        
        // Show welcome message
        player.showToast('Welcome to Harmony Music Player');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        // Show error to user
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = 'Failed to load music data. Please try again later.';
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
});
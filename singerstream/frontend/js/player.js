class MediaPlayer {
  constructor(audioElement, videoElement) {
    this.audioPlayer = audioElement;
    this.videoPlayer = videoElement;
    this.currentMedia = null;
    this.currentContent = null;
    this.initializeControls();
  }

  initializeControls() {
    // Play/Pause button
    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
      this.togglePlayPause();
    });

    // Seek bar
    document.getElementById('seekBar')?.addEventListener('input', (e) => {
      if (this.currentMedia) {
        const seekTime = (e.target.value / 100) * this.currentMedia.duration;
        this.currentMedia.currentTime = seekTime;
      }
    });

    // Volume control
    document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
      if (this.currentMedia) {
        this.currentMedia.volume = e.target.value / 100;
      }
    });

    // Update progress
    setInterval(() => this.updateProgress(), 100);
  }

  async loadContent(contentId) {
    try {
      // Fetch content details
      const content = await api.get(`/content/${contentId}`);
      this.currentContent = content;

      // Determine media type and load appropriate player
      if (content.type === 'video') {
        this.currentMedia = this.videoPlayer;
        this.audioPlayer.style.display = 'none';
        this.videoPlayer.style.display = 'block';
      } else {
        this.currentMedia = this.audioPlayer;
        this.videoPlayer.style.display = 'none';
        this.audioPlayer.style.display = 'block';
      }

      // Set source and load
      this.currentMedia.src = content.file_url;
      this.currentMedia.load();

      // Update UI
      this.updatePlayerUI(content);

      // Track analytics
      this.trackStreamStart(contentId);
    } catch (error) {
      console.error('Failed to load content:', error);
      alert('Failed to load content. Please try again.');
    }
  }

  togglePlayPause() {
    if (!this.currentMedia) return;

    if (this.currentMedia.paused) {
      this.currentMedia.play();
      document.getElementById('playPauseBtn').textContent = '⏸️ Pause';
    } else {
      this.currentMedia.pause();
      document.getElementById('playPauseBtn').textContent = '▶️ Play';
    }
  }

  updateProgress() {
    if (!this.currentMedia || !this.currentMedia.duration) return;

    const percent = (this.currentMedia.currentTime / this.currentMedia.duration) * 100;
    document.getElementById('seekBar').value = percent;
    document.getElementById('currentTime').textContent = this.formatTime(this.currentMedia.currentTime);
    document.getElementById('totalTime').textContent = this.formatTime(this.currentMedia.duration);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  updatePlayerUI(content) {
    document.getElementById('contentTitle').textContent = content.title;
    document.getElementById('contentDescription').textContent = content.description || '';
    if (content.thumbnail_url) {
      document.getElementById('contentThumbnail').src = content.thumbnail_url;
    }
  }

  async trackStreamStart(contentId) {
    try {
      await api.post('/analytics/track', {
        content_id: contentId,
        event_type: 'stream_start',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const audioEl = document.getElementById('audioPlayer');
  const videoEl = document.getElementById('videoPlayer');
  
  if (audioEl && videoEl) {
    window.player = new MediaPlayer(audioEl, videoEl);
    
    // Load content from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const contentId = urlParams.get('id');
    if (contentId) {
      player.loadContent(contentId);
    }
  }
});
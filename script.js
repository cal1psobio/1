const startScreen = document.getElementById('start-screen');
const glassCard = document.querySelector('.box-container');
const bgVisual = document.getElementById('bg-visual');
const music = document.getElementById('bg-music');

const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');

// Инициализация
if (music) music.volume = 0.3;

function showCard() {
    startScreen.style.opacity = '0';
    setTimeout(() => { startScreen.style.visibility = 'hidden'; }, 800);

    glassCard.classList.remove('hidden');
    glassCard.classList.add('visible');

    if (bgVisual) bgVisual.style.filter = 'brightness(0.3) blur(8px)';
    if (music) music.play();
}

function togglePlay() {
    if (music.paused) {
        music.play();
        playPauseBtn.classList.replace('fa-play', 'fa-pause');
    } else {
        music.pause();
        playPauseBtn.classList.replace('fa-pause', 'fa-play');
    }
}

if (music) {
    music.addEventListener('timeupdate', () => {
        const progress = (music.currentTime / music.duration) * 100;
        if (progressBar) progressBar.value = progress || 0;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(music.currentTime);
        if (durationEl && music.duration) durationEl.textContent = formatTime(music.duration);
    });
}

if (progressBar) {
    progressBar.addEventListener('input', () => {
        music.currentTime = (progressBar.value * music.duration) / 100;
    });
}

if (volumeBar) {
    volumeBar.addEventListener('input', () => {
        music.volume = volumeBar.value / 100;
        const volIcon = document.querySelector('.mini-volume-block i');
        if (volIcon) {
            volIcon.style.color = music.volume === 0 ? '#ff3333' : '#fff';
            volIcon.className = music.volume === 0 ? 'fa-solid fa-volume-mute' : 'fa-solid fa-volume-low';
        }
    });
}

function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// 3D Наклон
const motion = 8;
glassCard.addEventListener('mousemove', (e) => {
    if (glassCard.classList.contains('hidden')) return;
    const rect = glassCard.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    glassCard.style.transform = `perspective(1000px) rotateX(${-y * motion}deg) rotateY(${x * motion}deg)`;
});

glassCard.addEventListener('mouseleave', () => {
    glassCard.style.transition = "transform 0.5s ease";
    glassCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
});

glassCard.addEventListener('mouseenter', () => {
    glassCard.style.transition = "transform 0.1s ease";
});

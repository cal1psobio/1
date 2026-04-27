// 1. Объявление переменных
const startScreen = document.getElementById('start-screen');
const glassCard = document.querySelector('.glass-card');
const bgVisual = document.getElementById('bg-visual');
const music = document.getElementById('bg-music');

const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');

// Настройка звука
if (music) { music.volume = 0.3; }

// 2. Функция запуска
function showCard() {
    if (startScreen) {
        startScreen.style.opacity = '0';
        setTimeout(() => { startScreen.style.visibility = 'hidden'; }, 800);
    }

    if (glassCard) {
        glassCard.classList.remove('hidden');
        glassCard.classList.add('visible');
    }

    if (bgVisual) {
        bgVisual.style.filter = 'brightness(0.4) blur(10px)';
    }

    if (music) { music.play(); }
}

// 3. Логика плеера
function togglePlay() {
    if (!music) return;
    if (music.paused) {
        music.play();
        if (playPauseBtn) playPauseBtn.classList.replace('fa-play', 'fa-pause');
    } else {
        music.pause();
        if (playPauseBtn) playPauseBtn.classList.replace('fa-pause', 'fa-play');
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
            volIcon.className = music.volume === 0 ? 'fa-solid fa-volume-mute' : 'fa-solid fa-volume-low';
        }
    });
}

function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// 4. Эффект 3D наклона (только на саму карточку)
const motionQuantity = 8;

if (glassCard) {
    glassCard.addEventListener('mousemove', (e) => {
        if (glassCard.classList.contains('hidden')) return;

        const cardRect = glassCard.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const rotateX = (mouseY / (cardRect.height / 2)) * motionQuantity;
        const rotateY = -(mouseX / (cardRect.width / 2)) * motionQuantity;

        glassCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    glassCard.addEventListener('mouseleave', () => {
        glassCard.style.transition = 'transform 0.5s ease-out';
        glassCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });

    glassCard.addEventListener('mouseenter', () => {
        glassCard.style.transition = 'transform 0.1s ease-out';
    });
}

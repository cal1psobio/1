const music = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');
const startScreen = document.getElementById('start-screen');
const glassCard = document.getElementById('content');
const bgVisual = document.getElementById('bg-visual');
const bottomEdge = document.getElementById('bottom-edge');

function showCard() {
    startScreen.style.opacity = '0';
    startScreen.style.visibility = 'hidden';
    glassCard.classList.remove('hidden');
    glassCard.classList.add('visible');
    bgVisual.style.filter = 'brightness(0.3) blur(8px)';
    music.volume = 0.3;
    music.play();
    playPauseBtn.classList.replace('fa-play', 'fa-pause');
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

music.addEventListener('timeupdate', () => {
    const progress = (music.currentTime / music.duration) * 100;
    progressBar.value = progress || 0;
    currentTimeEl.textContent = formatTime(music.currentTime);
    if (music.duration) durationEl.textContent = formatTime(music.duration);
});

progressBar.addEventListener('input', () => {
    music.currentTime = (progressBar.value * music.duration) / 100;
});

volumeBar.addEventListener('input', () => {
    music.volume = volumeBar.value / 100;
    const volIcon = document.querySelector('.volume-controls i');
    if (music.volume === 0) {
        volIcon.classList.replace('fa-volume-high', 'fa-volume-mute');
    } else {
        volIcon.classList.replace('fa-volume-mute', 'fa-volume-high');
    }
});

function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

/* ═══════════════════════════════════════════════════
   ДИНАМІЧНИЙ 3D TILT + GLASS EDGE EFFECT

   Принцип роботи:
   - rotateY > 0  → карточка нахилена вправо  → права грань світліша
   - rotateY < 0  → карточка нахилена вліво   → ліва грань світліша
   - rotateX < 0  → карточка нахилена вниз    → нижня грань світліша

   Використовуємо CSS custom properties щоб керувати
   opacity псевдоелементів через JS.
   ═══════════════════════════════════════════════════ */

const MAX_TILT = 14;

// Кешуємо стилі для псевдоелементів через CSS vars на самій карточці
glassCard.addEventListener('mousemove', (e) => {
    const rect = glassCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 … +0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    const rotateX = -y * MAX_TILT;  // нахил верх/низ
    const rotateY =  x * MAX_TILT;  // нахил ліво/право

    glassCard.style.transition = 'transform 0.08s ease-out';
    glassCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;

    // ── Бокові грані ──
    // Права грань: з'являється коли rotateY > 0 (нахил вправо)
    // Ліва грань:  з'являється коли rotateY < 0 (нахил вліво)
    const absY = Math.abs(rotateY) / MAX_TILT; // 0…1

    if (rotateY > 0) {
        // нахил вправо → права грань видима, ліва зникає
        setEdgeOpacity('right', absY * 0.9);
        setEdgeOpacity('left',  0);
    } else {
        // нахил вліво → ліва грань видима, права зникає
        setEdgeOpacity('left',  absY * 0.9);
        setEdgeOpacity('right', 0);
    }

    // ── Нижня грань ──
    // З'являється коли rotateX < 0 (нахил вперед — мишка внизу)
    const absX = Math.abs(rotateX) / MAX_TILT;
    bottomEdge.style.opacity = rotateX < 0 ? absX * 0.85 : 0;
});

glassCard.addEventListener('mouseleave', () => {
    glassCard.style.transition = 'transform 0.6s cubic-bezier(.23,1,.32,1)';
    glassCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';

    // Плавно ховаємо всі грані
    setEdgeOpacity('left',  0);
    setEdgeOpacity('right', 0);
    bottomEdge.style.opacity = 0;
    bottomEdge.style.transition = 'opacity 0.6s ease';
});

// Псевдоелементи не можна керувати через JS напряму,
// тому використовуємо CSS custom properties
function setEdgeOpacity(side, value) {
    if (side === 'left') {
        glassCard.style.setProperty('--edge-left-opacity', value);
    } else {
        glassCard.style.setProperty('--edge-right-opacity', value);
    }
}
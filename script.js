const music = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');
const startScreen = document.getElementById('start-screen');
const cardsWrapper = document.getElementById('content');
const mainCard = document.querySelector('.main-card');
const bgVisual = document.getElementById('bg-visual');
const bottomEdge = document.getElementById('bottom-edge');
const showStatsBtn = document.getElementById('show-stats-btn');
const backToMainBtn = document.getElementById('back-to-main-btn');

function showCard() {
    startScreen.style.opacity = '0';
    startScreen.style.visibility = 'hidden';
    cardsWrapper.classList.remove('hidden');
    cardsWrapper.classList.add('visible');
    bgVisual.classList.add('card-open');
    music.volume = 0.3;
    music.play();
    playPauseBtn.classList.replace('fa-play', 'fa-pause');
}

showStatsBtn.addEventListener('click', openStats);
backToMainBtn.addEventListener('click', closeStats);

function openStats() {
    cardsWrapper.classList.add('show-stats');
    bgVisual.classList.add('stats-active');
    // Меняем картинку фона для статистики
    bgVisual.src = 'stats.gif';
}

function closeStats() {
    cardsWrapper.classList.remove('show-stats');
    bgVisual.classList.remove('stats-active');
    // Возвращаем оригинальный фон профиля
    bgVisual.src = 'background.gif';
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

// Оновлюємо загальний час треку одразу, як тільки браузер завантажить метадані
music.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(music.duration);
});

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
    if (isNaN(time)) return "00:00";
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
mainCard.addEventListener('mousemove', (e) => {
    const rect = mainCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 … +0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    const rotateX = -y * MAX_TILT;  // нахил верх/низ
    const rotateY =  x * MAX_TILT;  // нахил ліво/право

    mainCard.style.transition = 'transform 0.08s ease-out';
    mainCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;

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

mainCard.addEventListener('mouseleave', () => {
    mainCard.style.transition = 'transform 0.6s cubic-bezier(.23,1,.32,1)';
    mainCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';

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
        mainCard.style.setProperty('--edge-left-opacity', value);
    } else {
        mainCard.style.setProperty('--edge-right-opacity', value);
    }
}

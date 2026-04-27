const music = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// НОВЫЕ: Элементы громкости и стартового экрана
const volumeBar = document.getElementById('volume-bar');
const startScreen = document.getElementById('start-screen');
const glassCard = document.getElementById('content');
const bgVisual = document.getElementById('bg-visual');

// Функция перехода от надписи к панели
function showCard() {
    // 1. Скрываем стартовый экран
    startScreen.style.opacity = '0';
    startScreen.style.visibility = 'hidden';

    // 2. Показываем карточку (добавляем CSS класс)
    glassCard.classList.remove('hidden');
    glassCard.classList.add('visible');

    // 3. Усиливаем размытие фона (опционально, для акцента на карте)
    bgVisual.style.filter = 'brightness(0.3) blur(8px)';

    // 4. Запускаем музыку (начальная громкость 30%)
    music.volume = 0.3;
    music.play();
    playPauseBtn.classList.replace('fa-play', 'fa-pause');
}

// Плеер (старая логика Play/Pause)
function togglePlay() {
    if (music.paused) {
        music.play();
        playPauseBtn.classList.replace('fa-play', 'fa-pause');
    } else {
        music.pause();
        playPauseBtn.classList.replace('fa-pause', 'fa-play');
    }
}

// Прогресс бар
music.addEventListener('timeupdate', () => {
    const progress = (music.currentTime / music.duration) * 100;
    progressBar.value = progress || 0;
    currentTimeEl.textContent = formatTime(music.currentTime);
    if (music.duration) durationEl.textContent = formatTime(music.duration);
});

progressBar.addEventListener('input', () => {
    music.currentTime = (progressBar.value * music.duration) / 100;
});

// НОВАЯ: Регулировка громкости
volumeBar.addEventListener('input', () => {
    music.volume = volumeBar.value / 100;
    
    // Меняем иконку в зависимости от громкости (опционально)
    const volIcon = document.querySelector('.volume-controls i');
    if (music.volume === 0) {
        volIcon.classList.replace('fa-volume-high', 'fa-volume-mute');
    } else {
        volIcon.classList.replace('fa-volume-mute', 'fa-volume-high');
    }
});

// Форматирование времени
function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}
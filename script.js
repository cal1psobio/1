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
    startScreen.style.opacity = '0';
    startScreen.style.visibility = 'hidden';

    // Добавляем класс visible
    glassCard.classList.remove('hidden');
    glassCard.classList.add('visible'); 

    music.play();
}

// --- ОБНОВЛЕННАЯ ЛОГИКА ПЛЕЕРА ---

const music = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// Кнопки вперед/назад (для эффекта наведения)
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Настройка старта звука
music.volume = 0.3; // Убедимся, что громкость 30% при старте

// Основная функция запуска сайта (showCard из прошлых этапов)
function showCard() {
    startScreen.style.opacity = '0';
    startScreen.style.visibility = 'hidden';

    glassCard.classList.remove('hidden');
    glassCard.classList.add('visible');

    bgVisual.style.filter = 'brightness(0.3) blur(8px)';

    // Запускаем музыку при входе
    playMusic();
}

// Функции Play/Pause
function playMusic() {
    music.play();
    playPauseBtn.classList.replace('fa-play', 'fa-pause');
}

function pauseMusic() {
    music.pause();
    playPauseBtn.classList.replace('fa-pause', 'fa-play');
}

function togglePlay() {
    if (music.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

// Прогресс бар и время
music.addEventListener('timeupdate', () => {
    const progress = (music.currentTime / music.duration) * 100;
    progressBar.value = progress || 0;
    
    // Обновляем таймеры
    currentTimeEl.textContent = formatTime(music.currentTime);
    if (music.duration) durationEl.textContent = formatTime(music.duration);
});

// Перемотка трека
progressBar.addEventListener('input', () => {
    music.currentTime = (progressBar.value * music.duration) / 100;
});

// Регулировка громкости (обновленная)
volumeBar.addEventListener('input', () => {
    music.volume = volumeBar.value / 100;
    const volIcon = document.querySelector('.volume-controls-advanced i');
    
    if (music.volume === 0) {
        volIcon.classList.remove('fa-volume-low');
        volIcon.classList.add('fa-volume-mute');
        volIcon.style.color = '#ff3333';
    } else {
        volIcon.classList.add('fa-volume-low');
        volIcon.classList.remove('fa-volume-mute');
        volIcon.style.color = '#555';
    }
});

// Форматирование времени (стандартное)
function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Базовая реакция для кнопок (для эстетики)
prevBtn.addEventListener('click', () => { music.currentTime = 0; }); // Назад - сброс трека
nextBtn.addEventListener('click', () => { alert('No next track yet'); }); // Вперед - алерт

// --- ЭФФЕКТ ИНТЕРАКТИВНОГО 3D НАКЛОНА ---

const card = document.querySelector('.glass-card');

// Сила наклона (чем больше число, тем сильнее гнется)
const motionQuantity = 8; 

card.addEventListener('mousemove', (e) => {
    // Получаем размеры и положение карточки
    const cardRect = card.getBoundingClientRect();
    const cardWidth = cardRect.width;
    const cardHeight = cardRect.height;
    
    // Находим центр карточки
    const centerX = cardRect.left + cardWidth / 2;
    const centerY = cardRect.top + cardHeight / 2;
    
    // Получаем положение мышки относительно центра
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Рассчитываем углы поворота
    // rotateX зависит от движения по вертикали (mouseY), rotateY - по горизонтали (mouseX)
    // Мы делим на ширину/высоту, чтобы получить значение от -1 до 1, и умножаем на силу наклона
    const rotateX = (+1) * (mouseY / (cardHeight / 2)) * motionQuantity;
    const rotateY = (-1) * (mouseX / (cardWidth / 2)) * motionQuantity;
    
    /* Применяем трансформацию динамически. 
       translateZ(10px) добавляет еще больше глубины. */
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
});

// Возвращаем карточку в исходное состояние, когда мышка уходит
card.addEventListener('mouseleave', () => {
    // Добавляем transition чуть медленнее, чтобы она плавно вернулась
    card.style.transition = 'transform 0.5s ease-out';
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
});

// Убираем медленный transition, когда мышка снова заходит
card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease-out';
});

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
// --- ЭФФЕКТ ИНТЕРАКТИВНОГО 3D НАКЛОНА ---

const card = document.querySelector('.glass-card');

// Сила наклона (чем больше число, тем сильнее гнется)
const motionQuantity = 15; 

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

// 1. ОБЪЯВЛЕНИЕ ВСЕХ ПЕРЕМЕННЫХ (Один раз!)
const music = document.getElementById('bg-music');
const playPauseBtn = document.getElementById('play-pause-btn');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');

const startScreen = document.getElementById('start-screen');
const glassCard = document.querySelector('.glass-card'); // Используем класс
const bgVisual = document.getElementById('bg-visual');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Настройка звука при загрузке
music.volume = 0.3;

// 2. ФУНКЦИЯ ЗАПУСКА (Клик по стартовому экрану)
function showCard() {
    startScreen.style.opacity = '0';
    startScreen.style.visibility = 'hidden';

    glassCard.classList.remove('hidden');
    glassCard.classList.add('visible');

    // Эффект для фона
    if (bgVisual) {
        bgVisual.style.filter = 'brightness(0.3) blur(8px)';
    }

    playMusic();
}

// 3. ЛОГИКА ПЛЕЕРА
function playMusic() {
    music.play();
    if (playPauseBtn) playPauseBtn.classList.replace('fa-play', 'fa-pause');
}

function pauseMusic() {
    music.pause();
    if (playPauseBtn) playPauseBtn.classList.replace('fa-pause', 'fa-play');
}

function togglePlay() {
    if (music.paused) {
        playMusic();
    } else {
        pauseMusic();
    }
}

// Обновление прогресса
music.addEventListener('timeupdate', () => {
    const progress = (music.currentTime / music.duration) * 100;
    if (progressBar) progressBar.value = progress || 0;
    
    if (currentTimeEl) currentTimeEl.textContent = formatTime(music.currentTime);
    if (durationEl && music.duration) durationEl.textContent = formatTime(music.duration);
});

// Перемотка
if (progressBar) {
    progressBar.addEventListener('input', () => {
        music.currentTime = (progressBar.value * music.duration) / 100;
    });
}

// Громкость
if (volumeBar) {
   volumeBar.addEventListener('input', () => {
    music.volume = volumeBar.value / 100;
    const volIcon = document.querySelector('.volume-minimal i');
    
    if (music.volume === 0) {
        volIcon.className = 'fa-solid fa-volume-mute';
        volIcon.style.color = '#ff3333';
    } else {
        volIcon.className = 'fa-solid fa-volume-low';
        volIcon.style.color = '#555';
            }
        }
    });
}

function formatTime(time) {
    let min = Math.floor(time / 60);
    let sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Кнопки декоративные
if (prevBtn) prevBtn.addEventListener('click', () => { music.currentTime = 0; });
if (nextBtn) nextBtn.addEventListener('click', () => { console.log('Next track clicked'); });


// --- ЭФФЕКТ ИНТЕРАКТИВНОГО 3D НАКЛОНА (FIXED) ---
const motionQuantity = 8; 

// Вешаем событие строго НА КАРТОЧКУ, а не на документ
glassCard.addEventListener('mousemove', (e) => {
    // Если карточка еще скрыта (начальный экран), ничего не делаем
    if (glassCard.classList.contains('hidden')) return;

    const cardRect = glassCard.getBoundingClientRect();
    
    // Находим центр карточки
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;
    
    // Положение мышки относительно центра
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Рассчитываем углы
    const rotateX = (+1) * (mouseY / (cardRect.height / 2)) * motionQuantity;
    const rotateY = (-1) * (mouseX / (cardRect.width / 2)) * motionQuantity;
    
    // Применяем наклон
    glassCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
});

// Возвращаем в исходное положение, когда мышка ВЫХОДИТ за пределы карточки
glassCard.addEventListener('mouseleave', () => {
    glassCard.style.transition = 'transform 0.5s ease-out';
    glassCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
});

// Убираем задержку transition, когда мышка заходит обратно, чтобы наклон был мгновенным
glassCard.addEventListener('mouseenter', () => {
    glassCard.style.transition = 'transform 0.1s ease-out';
});

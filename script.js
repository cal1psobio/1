const startScreen = document.getElementById('start-screen');
const glassCard = document.querySelector('.box-container'); 
const music = document.getElementById('bg-music');
const volumeBar = document.getElementById('volume-bar');

function showCard() {
    startScreen.style.opacity = '0';
    setTimeout(() => { startScreen.style.visibility = 'hidden'; }, 800);
    glassCard.classList.remove('hidden');
    glassCard.classList.add('visible');
    if(music) { music.volume = 0.3; music.play(); }
}

const motion = 8;
glassCard.addEventListener('mousemove', (e) => {
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

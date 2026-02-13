// ============================================
// MUSIC PLAYER
// ============================================

const audioPlayer = document.getElementById('audio-player');
const musicToggle = document.getElementById('music-toggle');
const progressBar = document.getElementById('progress-bar');
const songSelect = document.getElementById('song-select');
const volumeControl = document.getElementById('volume-control');
const volumeValue = document.querySelector('.volume-value');
const expandToggle = document.getElementById('expand-toggle');
const musicPlayer = document.getElementById('music-player');
const positionButtons = document.querySelectorAll('.pos-btn');

// Song data
const songs = {
    '1': 'Jeff Buckley - Everybody Here Wants You (320 kbps).mp3',
    '2': 'Deftones - Cherry Waves (Lyrics).mp3'
};

let currentPosition = 'bottom-left';

// Initialize music player with saved preferences
function initMusicPlayer() {
    // Set initial volume
    audioPlayer.volume = 0.7;
    volumeValue.textContent = '70%';
    musicPlayer.classList.add('bottom-left');
    positionButtons[0].classList.add('active');

    // Set default song selection
    songSelect.value = '1';

    // Force load the Jeff Buckley song
    const jeffSong = songs['1'];
    audioPlayer.src = jeffSong;
    audioPlayer.load();
}

// Add error event listener
audioPlayer.addEventListener('error', (e) => {
    console.error('Audio loading error:', e);
    console.error('Error code:', audioPlayer.error?.code);
    console.error('Current src:', audioPlayer.src);
});

// Play/Pause toggle
musicToggle.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        musicToggle.classList.add('playing');
    } else {
        audioPlayer.pause();
        musicToggle.classList.remove('playing');
    }
});

// Update progress bar as music plays
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percentage;
    }
});

// Allow seeking
progressBar.addEventListener('input', () => {
    const time = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = time;
});

// Update duration when metadata loads
audioPlayer.addEventListener('loadedmetadata', () => {
    progressBar.max = 100;
});

// Expand/Collapse controls
expandToggle.addEventListener('click', () => {
    musicPlayer.classList.toggle('expanded');
    expandToggle.style.transform = musicPlayer.classList.contains('expanded')
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
});

// Song selection
songSelect.addEventListener('change', (e) => {
    const selectedSong = e.target.value;
    const newSrc = songs[selectedSong];

    // Stop current playback
    const wasPlaying = !audioPlayer.paused;
    audioPlayer.pause();

    // Change song and restart if it was playing
    audioPlayer.src = newSrc;
    if (wasPlaying) {
        audioPlayer.play();
    }
});

// Volume control
volumeControl.addEventListener('input', (e) => {
    const volume = e.target.value;
    audioPlayer.volume = volume / 100;
    volumeValue.textContent = volume + '%';
});

// Position controls
positionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const newPosition = btn.dataset.position;

        // Remove all position classes
        musicPlayer.classList.remove('bottom-left', 'bottom-right', 'top-left', 'top-right');

        // Add new position class
        musicPlayer.classList.add(newPosition);

        // Update active button
        positionButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentPosition = newPosition;
    });
});

// Initialize on page load
initMusicPlayer();

// ============================================
// CELEBRATION ANIMATION
// ============================================

function createCelebration() {
    // Start playing music
    if (audioPlayer.paused) {
        audioPlayer.play();
        musicToggle.classList.add('playing');
    }

    // Create floating hearts
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'celebration-hearts';
            heart.innerHTML = '💗';

            // Random horizontal position
            const startX = Math.random() * window.innerWidth;
            const endX = (Math.random() - 0.5) * 200; // drift left/right

            heart.style.left = startX + 'px';
            heart.style.top = window.innerHeight + 'px';
            heart.style.setProperty('--tx', endX + 'px');

            document.body.appendChild(heart);

            // Remove after animation completes
            setTimeout(() => heart.remove(), 2500);
        }, i * 100);
    }

    // Create sparkle confetti
    const sparkles = ['✨', '💕', '🌹', '⭐', '💑'];
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.innerHTML = sparkles[Math.floor(Math.random() * sparkles.length)];

            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-20px';
            confetti.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            confetti.style.opacity = Math.random() * 0.7 + 0.3;
            confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s ease-in forwards`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 80);
    }
}

// ============================================
// SCREEN MANAGEMENT
// ============================================

const screenAsk = document.getElementById('screen-ask');
const screenYes = document.getElementById('screen-yes');

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
}

// ============================================
// NEI BUTTON DODGING LOGIC
// ============================================

const btnNei = document.getElementById('btn-nei');
const btnJa = document.getElementById('btn-ja');
const neiCounter = document.getElementById('nei-counter');

let neiAttempts = 0;
let jaScale = 1;
const maxScale = 2.5;
const scaleIncrement = 0.15;

function dodgeNei() {
    // Increment attempts
    neiAttempts++;
    neiCounter.textContent = `Nei-Versuech: ${neiAttempts}`;

    // Increase Ja button size
    jaScale = Math.min(maxScale, jaScale + scaleIncrement);
    btnJa.style.transform = `scale(${jaScale})`;

    // Add dodge animation
    btnNei.classList.add('dodging');
    setTimeout(() => btnNei.classList.remove('dodging'), 300);

    // Move button to random position
    const container = document.querySelector('.ask-card');
    const containerRect = container.getBoundingClientRect();

    // Safe boundaries (don't go too far off)
    const padding = 20;
    const maxX = window.innerWidth - btnNei.offsetWidth - padding;
    const maxY = window.innerHeight - btnNei.offsetHeight - padding;
    const minX = padding;
    const minY = padding;

    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    btnNei.style.position = 'fixed';
    btnNei.style.left = randomX + 'px';
    btnNei.style.top = randomY + 'px';
    btnNei.style.zIndex = '5';
}

// Prevent Nei button from being clicked
btnNei.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeNei();
});

// Also dodge on mousedown/touchstart for mobile
btnNei.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeNei();
});

btnNei.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dodgeNei();
});

// ============================================
// JA BUTTON SUCCESS
// ============================================

btnJa.addEventListener('click', () => {
    // Transition to success screen
    showScreen(screenYes);

    // Trigger celebration
    createCelebration();

    // Reset state for potential re-use
    setTimeout(() => {
        neiAttempts = 0;
        jaScale = 1;
        btnJa.style.transform = 'scale(1)';
        btnNei.style.position = 'relative';
        btnNei.style.left = 'auto';
        btnNei.style.top = 'auto';
        neiCounter.textContent = '';
    }, 500);
});

// ============================================
// ACCESSIBILITY: Focus management
// ============================================

btnJa.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        btnJa.click();
    }
});

btnNei.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dodgeNei();
    }
});

// ============================================
// MOBILE: Ensure buttons stay usable
// ============================================

// Adjust touch handling for better mobile UX
if (window.matchMedia('(hover: none)').matches) {
    // Touch device - make Nei button harder to tap
    btnNei.style.pointerEvents = 'auto';
}

// ============================================
// INLINE PLAN DOCUMENT + DOWNLOAD
// ============================================

function getPlanItems() {
    const items = [];
    document.querySelectorAll('#plan-items .plan-item').forEach(el => {
        const time = el.querySelector('.time')?.textContent.trim() || '';
        const activity = el.querySelector('.activity')?.textContent.trim() || '';
        if (time || activity) items.push({ time, activity });
    });
    return items;
}

function formatPlanText(items) {
    let out = 'Euse Plan 13.02.2026\n\n';
    items.forEach(it => {
        out += `${it.time} — ${it.activity}\n`;
    });
    return out;
}

function buildICS(items) {
    const date = '20260213';
    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Valentine//EN\r\n';
    items.forEach((it, idx) => {
        const [hh, mm] = it.time.split(':');
        const start = `${date}T${hh}${mm}00`;
        let endHour = parseInt(hh, 10) + 1;
        let endMin = parseInt(mm, 10) + 30;
        if (endMin >= 60) { endHour += 1; endMin -= 60; }
        const end = `${date}T${String(endHour).padStart(2,'0')}${String(endMin).padStart(2,'0')}00`;
        ics += 'BEGIN:VEVENT\r\n';
        ics += `UID:valentine-plan-${idx}@local\r\n`;
        ics += `DTSTAMP:${date}T000000Z\r\n`;
        ics += `DTSTART:${start}\r\n`;
        ics += `DTEND:${end}\r\n`;
        ics += `SUMMARY:${it.activity}\r\n`;
        ics += 'END:VEVENT\r\n';
    });
    ics += 'END:VCALENDAR\r\n';
    return ics;
}

function populateInlinePlan() {
    const items = getPlanItems();
    const text = formatPlanText(items);
    const pre = document.getElementById('plan-doc-text');
    if (pre) pre.textContent = text;

    const txtBlob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const icsBlob = new Blob([buildICS(items)], { type: 'text/calendar;charset=utf-8' });

    const btn = document.getElementById('download-plan');
    if (btn) {
        btn.addEventListener('click', () => {
            const url = URL.createObjectURL(txtBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'plan-2026-02-13.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        });
    }
}

// populate on load
window.addEventListener('DOMContentLoaded', populateInlinePlan);


// Flowstate Interactive Script Engine

// 1. Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateCalculator();

    // Keyboard shortcut for Cmd+K command palette
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggleCommandPalette();
        }
        if (e.key === 'Escape') {
            const palette = document.getElementById('cmd-palette');
            if (!palette.classList.contains('hidden')) {
                palette.classList.add('hidden');
                palette.classList.remove('flex');
            }
        }
    });
});

// 2. Interactive Focus Timer Demo
let timerInterval = null;
let secondsRemaining = 1500; // 25 minutes
let isTimerRunning = false;

function toggleTimer() {
    const btnText = document.getElementById('timer-btn-text');
    const timerIcon = document.getElementById('timer-icon');
    const timerStatus = document.getElementById('timer-status');

    if (!isTimerRunning) {
        isTimerRunning = true;
        btnText.innerText = "Pause Focus";
        timerIcon.setAttribute('data-lucide', 'pause');
        timerStatus.innerText = "Deep Flow State Active";
        timerStatus.classList.add('text-brand-accent');

        timerInterval = setInterval(() => {
            if (secondsRemaining > 0) {
                secondsRemaining--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                btnText.innerText = "Start Focus";
                timerStatus.innerText = "Sprint Completed! Great work.";
                alert("🎉 Sprint Completed! Take a 5-minute breather.");
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        btnText.innerText = "Resume Focus";
        timerIcon.setAttribute('data-lucide', 'play');
        timerStatus.innerText = "Session Paused";
        timerStatus.classList.remove('text-brand-accent');
    }
    lucide.createIcons();
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    secondsRemaining = 1500;
    updateTimerDisplay();
    document.getElementById('timer-btn-text').innerText = "Start Focus";
    document.getElementById('timer-status').innerText = "Ready to focus";
    document.getElementById('timer-status').classList.remove('text-brand-accent');
    lucide.createIcons();
}

function updateTimerDisplay() {
    const minutes = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    const formatted = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('timer-display').innerText = formatted;

    // SVG Circle offset update (264 total circumference)
    const progressCircle = document.getElementById('timer-progress');
    const totalSeconds = 1500;
    const offset = 264 - (secondsRemaining / totalSeconds) * 264;
    progressCircle.style.strokeDashoffset = offset;
}

// 3. Interactive Task Toggle
function toggleTask(element) {
    element.classList.toggle('task-completed');
    const checkIcon = element.querySelector('.task-check');
    if (element.classList.contains('task-completed')) {
        checkIcon.style.opacity = '1';
    } else {
        checkIcon.style.opacity = '0';
    }
}

// 4. Native Web Audio API Sound Generator (Brown Noise & Binaural Synthesizer)
let audioCtx = null;
let activeSourceNode = null;
let gainNode = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.5;
        gainNode.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function stopAmbientSound() {
    if (activeSourceNode) {
        try {
            activeSourceNode.stop();
            activeSourceNode.disconnect();
        } catch (e) {}
        activeSourceNode = null;
    }
    document.getElementById('audio-active-label').innerText = "Status: Muted";
    document.getElementById('btn-ambient-stop').classList.add('hidden');
}

function playAmbientSound(type) {
    initAudio();
    stopAmbientSound();

    const label = document.getElementById('audio-active-label');
    const stopBtn = document.getElementById('btn-ambient-stop');
    stopBtn.classList.remove('hidden');

    if (type === 'brown' || type === 'rain') {
        // Generate Brown / Rain Noise using Buffer
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Boost amplitude
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        noise.connect(gainNode);
        noise.start();
        activeSourceNode = noise;

        label.innerText = type === 'brown' ? "Status: Playing Deep Brown Noise" : "Status: Playing Synthetic Rain";
    } else if (type === 'binaural') {
        // Generate 432Hz Carrier Wave with 10Hz Alpha Differential
        const oscLeft = audioCtx.createOscillator();
        const oscRight = audioCtx.createOscillator();
        const merger = audioCtx.createChannelMerger(2);

        oscLeft.type = 'sine';
        oscLeft.frequency.value = 216; // 432Hz harmonic base
        oscRight.type = 'sine';
        oscRight.frequency.value = 226; // +10Hz differential for Alpha wave flow

        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        merger.connect(gainNode);

        oscLeft.start();
        oscRight.start();

        activeSourceNode = {
            stop: function() {
                oscLeft.stop();
                oscRight.stop();
            },
            disconnect: function() {
                oscLeft.disconnect();
                oscRight.disconnect();
            }
        };

        label.innerText = "Status: Playing 432Hz Alpha Beats";
    }
}

function setAudioVolume(val) {
    if (gainNode) {
        gainNode.gain.value = parseFloat(val);
    }
}

// 5. ROI Time Saved Calculator Logic
function updateCalculator() {
    const hours = parseInt(document.getElementById('input-hours').value);
    const interruptions = parseInt(document.getElementById('input-interruptions').value);
    const rate = parseInt(document.getElementById('input-rate').value);

    document.getElementById('val-hours').innerText = `${hours} hrs`;
    document.getElementById('val-interruptions').innerText = `${interruptions} times`;
    document.getElementById('val-rate').innerText = `$${rate}/hr`;

    // Each interruption costs ~23.25 mins (0.387 hrs) of regain time + switching overhead
    const wastedHoursPerDay = Math.min(hours * 0.8, interruptions * 0.387 * (hours / 8));
    const monthlyWastedHours = wastedHoursPerDay * 22; // 22 work days/mo
    const recoverableHours = Math.round(monthlyWastedHours * 0.70); // Flowstate reclaims ~70%
    const monthlyValueLost = Math.round(recoverableHours * rate);
    const roiMultiplier = Math.round(monthlyValueLost / 12); // Based on $12/mo plan

    document.getElementById('calc-hours-saved').innerText = `${recoverableHours} hrs`;
    document.getElementById('calc-value-lost').innerText = `$${monthlyValueLost.toLocaleString()}`;
    document.getElementById('calc-roi').innerText = `${roiMultiplier}x`;
}

// 6. Pricing Annual / Monthly Toggle
let isAnnual = false;
function togglePricing() {
    isAnnual = !isAnnual;
    const dot = document.getElementById('toggle-dot');
    const proPrice = document.getElementById('price-pro');
    const teamPrice = document.getElementById('price-team');

    if (isAnnual) {
        dot.classList.add('translate-x-6');
        proPrice.innerText = "$9.60";
        teamPrice.innerText = "$23.20";
    } else {
        dot.classList.remove('translate-x-6');
        proPrice.innerText = "$12";
        teamPrice.innerText = "$29";
    }
}

function selectPlan(planName) {
    alert(`Thank you for selecting the ${planName} plan! Redirecting to secure checkout...`);
}

// 7. FAQ Accordion Toggle
function toggleFaq(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('[data-lucide="chevron-down"]');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
    }
}

// 8. Command Palette Modal & Scroll Helper
function toggleCommandPalette() {
    const palette = document.getElementById('cmd-palette');
    if (palette.classList.contains('hidden')) {
        palette.classList.remove('hidden');
        palette.classList.add('flex');
    } else {
        palette.classList.add('hidden');
        palette.classList.remove('flex');
    }
}

function scrollToSection(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
    }
}
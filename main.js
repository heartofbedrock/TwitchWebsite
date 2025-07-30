// Main JS for Twitch bits bottle cap animation
// Configuration: fill in with your Twitch credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const OAUTH_TOKEN = 'YOUR_OAUTH_TOKEN'; // format: "oauth:xxxxxxxxxxx"
const CHANNEL_ID = 'YOUR_CHANNEL_ID';
const GOAL_BITS = 12000;

let ws = null;
let bitsTotal = 0;
let reconnectTimer = null;

const capContainer = document.getElementById('cap-container');
const overlay = document.getElementById('goal-overlay');
const resetBtn = document.getElementById('reset-btn');

// Initialize WebSocket connection to Twitch PubSub
function connect() {
    ws = new WebSocket('wss://pubsub-edge.twitch.tv');

    ws.addEventListener('open', () => {
        listenForBits();
        pingLoop();
    });

    ws.addEventListener('message', (event) => {
        handleMessage(event.data);
    });

    ws.addEventListener('close', () => {
        scheduleReconnect();
    });

    ws.addEventListener('error', () => {
        scheduleReconnect();
    });
}

function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
    }, 5000);
}

// Listen to bits events for the specified channel
function listenForBits() {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const nonce = Math.random().toString(36).substring(2);
    const message = {
        type: 'LISTEN',
        nonce,
        data: {
            topics: [`channel-bits-events-v2.${CHANNEL_ID}`],
            auth_token: OAUTH_TOKEN.replace(/^oauth:/, '')
        }
    };
    ws.send(JSON.stringify(message));
}

// Ping every 4 minutes to keep connection alive
function pingLoop() {
    setInterval(() => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'PING' }));
        }
    }, 1000 * 60 * 4);
}

function handleMessage(data) {
    try {
        const msg = JSON.parse(data);
        if (msg.type === 'MESSAGE') {
            const parsed = JSON.parse(msg.data.message);
            const bits = parsed.data.bits_used || parsed.data.bits; // handle different schemas
            addBits(bits);
        }
    } catch (e) {
        console.error('Failed to parse message', e);
    }
}

function addBits(bits) {
    if (!bits) return;
    bitsTotal += bits;
    for (let i = 0; i < bits; i++) {
        dropCap();
    }
    checkGoal();
}

function dropCap() {
    const cap = document.createElement('div');
    cap.className = 'bottle-cap';
    cap.style.left = Math.random() * (window.innerWidth - 40) + 'px';
    cap.addEventListener('animationend', () => {
        cap.style.transform = `translateY(calc(100vh - var(--cap-size)))`;
    });
    capContainer.appendChild(cap);
}

function checkGoal() {
    if (bitsTotal >= GOAL_BITS) {
        celebrate();
    }
}

function celebrate() {
    overlay.classList.remove('hidden');
    confetti({ particleCount: 200, spread: 70 });
}

resetBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    bitsTotal = 0;
    capContainer.innerHTML = '';
});

connect();

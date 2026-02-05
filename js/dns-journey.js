/**
 * DNS Journey Interactive
 * Visualizes how a domain name gets resolved to an IP address
 * and how a webpage is fetched - explained simply!
 */

// Fake IP addresses for demo domains
const DOMAIN_IPS = {
    'google.com': '142.250.80.46',
    'facebook.com': '157.240.1.35',
    'twitter.com': '104.244.42.193',
    'github.com': '140.82.121.4',
    'youtube.com': '142.250.82.110',
    'amazon.com': '52.94.236.248',
    'netflix.com': '54.237.226.164',
    'reddit.com': '151.101.1.140',
    'wikipedia.org': '208.80.154.224',
    'apple.com': '17.253.144.10',
};

// Speed settings (delays in ms)
const SPEEDS = {
    slow: { step: 2000, packet: 1000, typing: 80 },
    medium: { step: 1200, packet: 600, typing: 40 },
    fast: { step: 600, packet: 300, typing: 20 }
};

// Journey steps with explanations
const JOURNEY_STEPS = [
    {
        id: 'typing',
        icon: '⌨️',
        title: 'You type the address',
        description: 'You enter "{domain}" in your browser\'s address bar and press Enter.'
    },
    {
        id: 'asking-dns',
        icon: '🔍',
        title: 'Browser asks DNS',
        description: 'Your browser doesn\'t know where "{domain}" is. It asks the DNS resolver: "What\'s the IP address for {domain}?"'
    },
    {
        id: 'dns-lookup',
        icon: '📖',
        title: 'DNS looks it up',
        description: 'The DNS resolver searches its records... Found it! {domain} lives at IP address {ip}.'
    },
    {
        id: 'dns-response',
        icon: '📬',
        title: 'DNS sends back the IP',
        description: 'DNS tells your browser: "The address for {domain} is {ip}". Now we know where to go!'
    },
    {
        id: 'connecting',
        icon: '🔌',
        title: 'Connecting to server',
        description: 'Your browser connects directly to the server at {ip} and asks: "Please send me the webpage!"'
    },
    {
        id: 'server-response',
        icon: '📦',
        title: 'Server sends the page',
        description: 'The server at {ip} packages up the HTML, CSS, images, and sends them back to you.'
    },
    {
        id: 'complete',
        icon: '🎉',
        title: 'Page loaded!',
        description: 'Your browser receives all the files and renders the beautiful {domain} webpage. All done in milliseconds!'
    }
];

class DNSJourney {
    constructor() {
        this.currentStep = -1;
        this.isRunning = false;
        this.speed = 'medium';
        this.domain = 'google.com';
        this.ip = '';
        this.animationTimeout = null;

        this.initElements();
        this.initEventListeners();
    }

    initElements() {
        // Input elements
        this.domainInput = document.getElementById('domain-input');
        this.btnGo = document.getElementById('btn-go');
        this.btnReset = document.getElementById('btn-reset');
        this.speedSelect = document.getElementById('speed-select');

        // Journey step elements
        this.stepComputer = document.getElementById('step-computer');
        this.stepDns = document.getElementById('step-dns');
        this.stepServer = document.getElementById('step-server');

        // Status elements
        this.computerStatus = document.getElementById('computer-status');
        this.dnsStatus = document.getElementById('dns-status');
        this.serverStatus = document.getElementById('server-status');
        this.serverIp = document.getElementById('server-ip');

        // Pulse elements
        this.computerPulse = document.getElementById('computer-pulse');
        this.dnsPulse = document.getElementById('dns-pulse');
        this.serverPulse = document.getElementById('server-pulse');

        // Connection lines
        this.lineComputerDns = document.getElementById('line-computer-dns');
        this.lineDnsServer = document.getElementById('line-dns-server');

        // Packet animation
        this.packet = document.getElementById('packet');

        // Journey log
        this.journeyLog = document.getElementById('journey-log');

        // Explanation panel
        this.stepIcon = document.getElementById('step-icon');
        this.stepTitle = document.getElementById('step-title');
        this.stepDescription = document.getElementById('step-description');
    }

    initEventListeners() {
        this.btnGo.addEventListener('click', () => this.startJourney());
        this.btnReset.addEventListener('click', () => this.reset());
        this.speedSelect.addEventListener('change', (e) => {
            this.speed = e.target.value;
        });
        this.domainInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startJourney();
        });
    }

    getIP(domain) {
        // Check if we have a predefined IP
        const cleanDomain = domain.toLowerCase().trim();
        if (DOMAIN_IPS[cleanDomain]) {
            return DOMAIN_IPS[cleanDomain];
        }
        // Generate a fake but realistic-looking IP
        const hash = cleanDomain.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return `${(hash % 200) + 50}.${(hash * 2) % 256}.${(hash * 3) % 256}.${(hash * 4) % 256}`;
    }

    async startJourney() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.btnGo.disabled = true;
        this.btnGo.classList.add('opacity-50');

        this.domain = this.domainInput.value.trim() || 'google.com';
        this.ip = this.getIP(this.domain);

        this.clearLog();
        this.currentStep = 0;

        const speeds = SPEEDS[this.speed];

        // Step 1: Typing
        await this.showStep(0, speeds);
        this.activateElement(this.stepComputer, this.computerPulse);
        this.computerStatus.textContent = 'Typing...';
        await this.typeInLog(`You type: ${this.domain}`, 'text-blue-400');
        await this.delay(speeds.step);

        // Step 2: Asking DNS
        await this.showStep(1, speeds);
        this.computerStatus.textContent = 'Asking DNS...';
        await this.addToLog('Browser: "I need to find this website..."', 'text-gray-400');
        await this.animatePacket('computer', 'dns', speeds);
        this.activateElement(this.stepDns, this.dnsPulse);
        this.deactivateElement(this.stepComputer, this.computerPulse);
        this.dnsStatus.textContent = 'Received query';
        await this.addToLog(`→ DNS Query: "Where is ${this.domain}?"`, 'text-yellow-400');
        await this.delay(speeds.step);

        // Step 3: DNS Lookup
        await this.showStep(2, speeds);
        this.dnsStatus.textContent = 'Searching...';
        await this.addToLog('DNS: "Let me check my records..."', 'text-orange-400');
        await this.delay(speeds.step / 2);
        await this.addToLog(`DNS: "Found it! ${this.domain} = ${this.ip}"`, 'text-orange-400');
        await this.delay(speeds.step / 2);

        // Step 4: DNS Response
        await this.showStep(3, speeds);
        this.dnsStatus.textContent = 'Sending response';
        await this.animatePacket('dns', 'computer', speeds);
        this.activateElement(this.stepComputer, this.computerPulse);
        this.deactivateElement(this.stepDns, this.dnsPulse);
        this.computerStatus.textContent = 'Got IP!';
        await this.addToLog(`← DNS Response: IP = ${this.ip}`, 'text-green-400');
        await this.delay(speeds.step);

        // Step 5: Connecting to Server
        await this.showStep(4, speeds);
        this.serverIp.textContent = `IP: ${this.ip}`;
        this.computerStatus.textContent = 'Connecting...';
        await this.addToLog(`Browser: "Connecting to ${this.ip}..."`, 'text-blue-400');
        await this.animatePacket('computer', 'server', speeds);
        this.activateElement(this.stepServer, this.serverPulse);
        this.deactivateElement(this.stepComputer, this.computerPulse);
        this.serverStatus.textContent = 'Request received';
        await this.addToLog(`→ HTTP Request: "GET / from ${this.domain}"`, 'text-cyan-400');
        await this.delay(speeds.step);

        // Step 6: Server Response
        await this.showStep(5, speeds);
        this.serverStatus.textContent = 'Sending page...';
        await this.addToLog('Server: "Here\'s the webpage!"', 'text-green-400');
        await this.animatePacket('server', 'computer', speeds);
        this.activateElement(this.stepComputer, this.computerPulse);
        this.deactivateElement(this.stepServer, this.serverPulse);
        this.computerStatus.textContent = 'Receiving...';
        await this.addToLog('← HTML, CSS, JavaScript, Images...', 'text-purple-400');
        await this.delay(speeds.step);

        // Step 7: Complete
        await this.showStep(6, speeds);
        this.computerStatus.textContent = 'Page loaded! ✓';
        this.serverStatus.textContent = 'Done';
        this.dnsStatus.textContent = 'Done';
        await this.addToLog(`✅ ${this.domain} loaded successfully!`, 'text-green-400 font-bold');

        // Clean up
        this.deactivateElement(this.stepComputer, this.computerPulse);
        this.isRunning = false;
        this.btnGo.disabled = false;
        this.btnGo.classList.remove('opacity-50');
    }

    async showStep(stepIndex, speeds) {
        const step = JOURNEY_STEPS[stepIndex];
        this.currentStep = stepIndex;

        // Update explanation panel
        this.stepIcon.textContent = step.icon;
        this.stepTitle.textContent = step.title;
        this.stepDescription.textContent = step.description
            .replace(/{domain}/g, this.domain)
            .replace(/{ip}/g, this.ip);

        // Highlight current step indicator could go here
    }

    activateElement(element, pulseElement) {
        element.classList.remove('opacity-40');
        element.classList.add('active');
        if (pulseElement) pulseElement.classList.remove('hidden');
    }

    deactivateElement(element, pulseElement) {
        element.classList.remove('active');
        if (pulseElement) pulseElement.classList.add('hidden');
    }

    async animatePacket(from, to, speeds) {
        const positions = {
            computer: 60,
            dns: this.getContainerWidth() / 2 - 20,
            server: this.getContainerWidth() - 100
        };

        this.packet.classList.remove('hidden');
        this.packet.style.left = `${positions[from]}px`;

        // Trigger reflow for animation
        void this.packet.offsetWidth;

        this.packet.style.left = `${positions[to]}px`;

        await this.delay(speeds.packet);
        this.packet.classList.add('hidden');
    }

    getContainerWidth() {
        const container = document.getElementById('journey-container');
        return container ? container.offsetWidth : 800;
    }

    clearLog() {
        this.journeyLog.innerHTML = '';
    }

    async addToLog(message, colorClass = 'text-gray-300') {
        const entry = document.createElement('div');
        entry.className = `${colorClass} bounce-in`;
        entry.textContent = message;
        this.journeyLog.appendChild(entry);
        this.journeyLog.scrollTop = this.journeyLog.scrollHeight;
    }

    async typeInLog(message, colorClass = 'text-gray-300') {
        const speeds = SPEEDS[this.speed];
        const entry = document.createElement('div');
        entry.className = colorClass;
        this.journeyLog.appendChild(entry);

        for (let i = 0; i <= message.length; i++) {
            entry.textContent = message.substring(0, i) + (i < message.length ? '|' : '');
            await this.delay(speeds.typing);
        }
        this.journeyLog.scrollTop = this.journeyLog.scrollHeight;
    }

    reset() {
        // Clear any pending animations
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }

        this.isRunning = false;
        this.currentStep = -1;
        this.btnGo.disabled = false;
        this.btnGo.classList.remove('opacity-50');

        // Reset elements
        this.stepComputer.classList.remove('active');
        this.stepComputer.classList.remove('opacity-40');
        this.stepDns.classList.remove('active');
        this.stepDns.classList.add('opacity-40');
        this.stepServer.classList.remove('active');
        this.stepServer.classList.add('opacity-40');

        // Hide pulses
        this.computerPulse.classList.add('hidden');
        this.dnsPulse.classList.add('hidden');
        this.serverPulse.classList.add('hidden');

        // Reset status
        this.computerStatus.textContent = 'Ready';
        this.dnsStatus.textContent = 'Waiting';
        this.serverStatus.textContent = 'Waiting';
        this.serverIp.textContent = 'IP: ???';

        // Hide packet
        this.packet.classList.add('hidden');

        // Reset log
        this.journeyLog.innerHTML = '<div class="text-gray-500 italic">Click "Go!" to start the journey...</div>';

        // Reset explanation
        this.stepIcon.textContent = '🖥️';
        this.stepTitle.textContent = 'Ready to explore!';
        this.stepDescription.textContent = 'Type a website address above and click "Go!" to see how your browser finds and loads a website.';
    }

    delay(ms) {
        return new Promise(resolve => {
            this.animationTimeout = setTimeout(resolve, ms);
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dnsJourney = new DNSJourney();
});

/**
 * Distributed Network Consensus Interactive
 * Demonstrates how transactions propagate through a network and nodes synchronize
 */

// Network configuration
const NODE_POSITIONS = [
    { id: 0, name: 'Node A', x: 0.5, y: 0.15 },
    { id: 1, name: 'Node B', x: 0.25, y: 0.4 },
    { id: 2, name: 'Node C', x: 0.75, y: 0.4 },
    { id: 3, name: 'Node D', x: 0.3, y: 0.75 },
    { id: 4, name: 'Node E', x: 0.7, y: 0.75 },
];

// Network connections (edges between nodes)
const CONNECTIONS = [
    [0, 1], [0, 2],
    [1, 2], [1, 3],
    [2, 4],
    [3, 4],
];

// Speed settings (delays in ms)
const SPEEDS = {
    slow: { propagate: 800, sync: 500 },
    medium: { propagate: 400, sync: 300 },
    fast: { propagate: 200, sync: 150 }
};

class DistributedNetwork {
    constructor() {
        this.nodes = [];
        this.connections = CONNECTIONS;
        this.transactions = [];
        this.txCount = 0;
        this.selectedNode = null;
        this.speed = 'medium';
        this.isProcessing = false;

        this.initElements();
        this.initNetwork();
        this.initEventListeners();
        this.render();
    }

    initElements() {
        this.container = document.getElementById('network-container');
        this.nodesContainer = document.getElementById('nodes-container');
        this.connectionsSvg = document.getElementById('connections-svg');
        this.txInput = document.getElementById('tx-input');

        // Status elements
        this.txCountEl = document.getElementById('tx-count');
        this.syncedCountEl = document.getElementById('synced-count');
        this.totalNodesEl = document.getElementById('total-nodes');
        this.networkStateEl = document.getElementById('network-state');

        // Inspector elements
        this.selectedNodeInfo = document.getElementById('selected-node-info');
        this.nodeLedger = document.getElementById('node-ledger');

        // Control elements
        this.txAmountInput = document.getElementById('tx-amount');
        this.txFromInput = document.getElementById('tx-from');
        this.txToInput = document.getElementById('tx-to');
        this.btnSendTx = document.getElementById('btn-send-tx');
        this.btnReset = document.getElementById('btn-reset');
        this.speedSelect = document.getElementById('speed-select');
    }

    initNetwork() {
        // Create node objects
        this.nodes = NODE_POSITIONS.map(pos => ({
            ...pos,
            state: 'idle', // idle, receiving, synced
            ledger: [],
            element: null
        }));

        this.totalNodesEl.textContent = this.nodes.length;
    }

    initEventListeners() {
        this.btnSendTx.addEventListener('click', () => this.sendTransaction());
        this.btnReset.addEventListener('click', () => this.resetNetwork());
        this.speedSelect.addEventListener('change', (e) => {
            this.speed = e.target.value;
        });
        this.txInput.addEventListener('click', () => this.sendTransaction());

        // Handle window resize
        window.addEventListener('resize', () => this.render());
    }

    render() {
        this.renderConnections();
        this.renderNodes();
    }

    renderConnections() {
        const rect = this.container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        let svg = '';
        this.connections.forEach(([from, to]) => {
            const fromNode = this.nodes[from];
            const toNode = this.nodes[to];
            const x1 = fromNode.x * width;
            const y1 = fromNode.y * height;
            const x2 = toNode.x * width;
            const y2 = toNode.y * height;

            svg += `<line
                x1="${x1}" y1="${y1}"
                x2="${x2}" y2="${y2}"
                stroke="#3f3f4a"
                stroke-width="2"
                class="connection-line"
                data-from="${from}"
                data-to="${to}"
            />`;
        });

        this.connectionsSvg.innerHTML = svg;
    }

    renderNodes() {
        const rect = this.container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        this.nodesContainer.innerHTML = '';

        this.nodes.forEach((node, index) => {
            const x = node.x * width;
            const y = node.y * height;

            const nodeEl = document.createElement('div');
            nodeEl.className = `node absolute transform -translate-x-1/2 -translate-y-1/2`;
            nodeEl.style.left = `${x}px`;
            nodeEl.style.top = `${y}px`;
            nodeEl.dataset.nodeId = index;

            const stateColor = this.getStateColor(node.state);
            const syncedClass = node.state === 'synced' ? 'synced' : '';
            const receivingClass = node.state === 'receiving' ? 'receiving' : '';

            nodeEl.innerHTML = `
                <div class="relative">
                    <div class="w-14 h-14 rounded-xl ${stateColor} flex items-center justify-center ${syncedClass} ${receivingClass} transition-all">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"></path>
                        </svg>
                    </div>
                    <div class="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                        ${node.name}
                    </div>
                    ${node.ledger.length > 0 ? `
                        <div class="absolute -top-2 -right-2 w-5 h-5 bg-accent-primary rounded-full flex items-center justify-center text-xs text-white font-bold">
                            ${node.ledger.length}
                        </div>
                    ` : ''}
                </div>
            `;

            nodeEl.addEventListener('click', () => this.selectNode(index));
            this.nodesContainer.appendChild(nodeEl);
            node.element = nodeEl;
        });
    }

    getStateColor(state) {
        switch (state) {
            case 'receiving':
                return 'bg-yellow-500';
            case 'synced':
                return 'bg-green-500';
            default:
                return 'bg-gray-600';
        }
    }

    selectNode(index) {
        this.selectedNode = index;
        const node = this.nodes[index];

        this.selectedNodeInfo.innerHTML = `
            <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 rounded-full ${this.getStateColor(node.state)}"></div>
                <span class="font-medium">${node.name}</span>
                <span class="text-gray-500">(${node.state})</span>
            </div>
            <div class="text-xs text-gray-500">
                Transactions received: ${node.ledger.length}
            </div>
        `;

        if (node.ledger.length === 0) {
            this.nodeLedger.innerHTML = '<span class="text-gray-500 italic">No transactions yet</span>';
        } else {
            this.nodeLedger.innerHTML = node.ledger.map((tx, i) => `
                <div class="ledger-entry py-1 border-b border-dark-600 last:border-0">
                    <span class="text-gray-500">#${tx.id}:</span>
                    <span class="text-cyan-400">${tx.from}</span>
                    <span class="text-gray-500">→</span>
                    <span class="text-purple-400">${tx.to}</span>
                    <span class="text-green-400">${tx.amount}</span>
                </div>
            `).join('');
        }
    }

    async sendTransaction() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        this.btnSendTx.disabled = true;
        this.btnSendTx.classList.add('opacity-50');

        const amount = parseInt(this.txAmountInput.value) || 100;
        const from = this.txFromInput.value || 'Alice';
        const to = this.txToInput.value || 'Bob';

        this.txCount++;
        const tx = {
            id: this.txCount,
            from,
            to,
            amount,
            timestamp: Date.now()
        };

        this.transactions.push(tx);
        this.txCountEl.textContent = this.txCount;
        this.networkStateEl.textContent = 'Broadcasting...';

        // Start propagation from first node (Node A)
        await this.propagateTransaction(tx, 0);

        this.networkStateEl.textContent = 'Synchronized';
        this.updateSyncedCount();
        this.render();

        // Update inspector if node is selected
        if (this.selectedNode !== null) {
            this.selectNode(this.selectedNode);
        }

        this.isProcessing = false;
        this.btnSendTx.disabled = false;
        this.btnSendTx.classList.remove('opacity-50');
    }

    async propagateTransaction(tx, startNodeId) {
        const speeds = SPEEDS[this.speed];
        const visited = new Set();
        const queue = [startNodeId];

        while (queue.length > 0) {
            const currentBatch = [...queue];
            queue.length = 0;

            // Process all nodes in current batch simultaneously
            await Promise.all(currentBatch.map(async (nodeId) => {
                if (visited.has(nodeId)) return;
                visited.add(nodeId);

                const node = this.nodes[nodeId];

                // Show receiving state
                node.state = 'receiving';
                this.networkStateEl.textContent = `${node.name} receiving...`;
                this.render();

                await this.delay(speeds.propagate);

                // Add transaction to ledger
                node.ledger.push({ ...tx });
                node.state = 'synced';
                this.render();

                await this.delay(speeds.sync);

                // Find connected nodes to propagate to
                this.connections.forEach(([from, to]) => {
                    if (from === nodeId && !visited.has(to)) {
                        queue.push(to);
                    } else if (to === nodeId && !visited.has(from)) {
                        queue.push(from);
                    }
                });
            }));
        }
    }

    updateSyncedCount() {
        const synced = this.nodes.filter(n => n.state === 'synced').length;
        this.syncedCountEl.textContent = synced;
    }

    resetNetwork() {
        this.nodes.forEach(node => {
            node.state = 'idle';
            node.ledger = [];
        });
        this.transactions = [];
        this.txCount = 0;
        this.selectedNode = null;

        this.txCountEl.textContent = '0';
        this.syncedCountEl.textContent = '0';
        this.networkStateEl.textContent = 'Idle';
        this.selectedNodeInfo.innerHTML = '<span class="text-gray-500 italic">No node selected</span>';
        this.nodeLedger.innerHTML = '<span class="text-gray-500 italic">Select a node to view ledger</span>';

        this.render();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.distributedNetwork = new DistributedNetwork();
});

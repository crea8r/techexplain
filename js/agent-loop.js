/**
 * Agent Loop Interactive Simulator (Enhanced)
 * Demonstrates how AI agents work through a detailed loop visualization
 * showing the Perceive → Decide → Act cycle
 */

// Scenario definitions with detailed component breakdowns
const SCENARIOS = {
    math: {
        id: 'math',
        name: 'Simple Math',
        goal: 'Calculate (2+2) × 3',
        loops: [
            {
                perceive: "Goal requires two operations. No previous results yet.",
                decide: "Start with the first operation: addition.",
                act: "Ask LLM to compute 2 + 2",
                request: "What is 2 + 2?",
                response: "2 + 2 = 4",
                context: "First result: 4",
                reasoning: "Got 4. Now need to multiply by 3 to complete the goal.",
                shouldContinue: true
            },
            {
                perceive: "Have result 4 from first operation. Need multiplication.",
                decide: "Perform the second operation with the result.",
                act: "Ask LLM to multiply 4 by 3",
                request: "Now multiply 4 by 3",
                response: "4 × 3 = 12. The calculation is complete.",
                context: "Final result: 12",
                reasoning: "Both operations complete. Goal achieved!",
                shouldContinue: false
            }
        ],
        result: "Final Result: 12"
    },
    research: {
        id: 'research',
        name: 'Research Task',
        goal: 'Find the capital of France and its population',
        loops: [
            {
                perceive: "Need two pieces of information: capital and population.",
                decide: "Start by finding the capital city.",
                act: "Query LLM for capital of France",
                request: "What is the capital of France?",
                response: "The capital of France is Paris.",
                context: "Capital: Paris",
                reasoning: "Got the capital. Now need population data.",
                shouldContinue: true
            },
            {
                perceive: "Know capital is Paris. Still need population.",
                decide: "Query for population of the identified capital.",
                act: "Ask LLM for Paris population",
                request: "What is the population of Paris?",
                response: "Paris has a population of approximately 2.1 million in the city proper.",
                context: "Capital: Paris, Population: ~2.1M",
                reasoning: "Have both pieces. Need to compile into final answer.",
                shouldContinue: true
            },
            {
                perceive: "Have all required data. Need to format response.",
                decide: "Compile information into a complete answer.",
                act: "Request final compilation",
                request: "Compile the final answer about France's capital and population.",
                response: "Complete: Paris is the capital of France with a population of ~2.1 million.",
                context: "Answer compiled and verified",
                reasoning: "All information gathered and formatted. Task complete!",
                shouldContinue: false
            }
        ],
        result: "Final Result: Paris is the capital of France, population ~2.1 million"
    },
    code: {
        id: 'code',
        name: 'Code Writing',
        goal: 'Write a function to reverse a string',
        loops: [
            {
                perceive: "Task: create a string reversal function. No code yet.",
                decide: "First, plan the approach before writing code.",
                act: "Request algorithm planning",
                request: "Plan an approach to reverse a string in JavaScript.",
                response: "Approach: Split string into array, reverse array, join back to string.",
                context: "Algorithm planned: split → reverse → join",
                reasoning: "Have a solid plan. Now implement the actual code.",
                shouldContinue: true
            },
            {
                perceive: "Have algorithm plan. Ready to write code.",
                decide: "Implement the function following the plan.",
                act: "Request code implementation",
                request: "Write the reverseString function using this approach.",
                response: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
                context: "Code written, not yet tested",
                reasoning: "Code looks correct but should verify with a test.",
                shouldContinue: true
            },
            {
                perceive: "Function written. Need to verify it works.",
                decide: "Test the function with a sample input.",
                act: "Request test execution",
                request: "Test the function with 'hello'.",
                response: "reverseString('hello') returns 'olleh'. Test passed!",
                context: "Test passed: 'hello' → 'olleh'",
                reasoning: "Test passed. Should confirm task is fully complete.",
                shouldContinue: true
            },
            {
                perceive: "Code written and tested successfully.",
                decide: "Get final confirmation that task is complete.",
                act: "Request completion confirmation",
                request: "Confirm the reverseString function is complete and working.",
                response: "Confirmed: reverseString function works correctly. It reverses any input string.",
                context: "Function verified and ready for use",
                reasoning: "Function verified and working. Task complete!",
                shouldContinue: false
            }
        ],
        result: "Final Result: Working reverseString() function created and tested"
    },
    trading: {
        id: 'trading',
        name: 'Trading Decision',
        goal: 'Analyze BTC price trend and decide whether to buy, sell, or hold',
        loops: [
            {
                perceive: "Need market data to make trading decision.",
                decide: "First, gather current price and recent trend data.",
                act: "Request price analysis",
                request: "What is the current BTC price trend over the last 24 hours?",
                response: "BTC is at $67,500, up 3.2% in 24h. RSI at 58, showing moderate bullish momentum.",
                context: "BTC: $67.5K, +3.2%, RSI: 58",
                reasoning: "Price rising with healthy RSI. Need to check support/resistance levels.",
                shouldContinue: true
            },
            {
                perceive: "Have price and momentum data. Need technical levels.",
                decide: "Analyze key support and resistance levels.",
                act: "Request technical analysis",
                request: "What are the key support and resistance levels for BTC?",
                response: "Support at $65,000, resistance at $70,000. Currently in middle of range with room to move.",
                context: "Support: $65K, Resistance: $70K, Current: $67.5K",
                reasoning: "In middle of range, bullish momentum. Evaluate risk/reward for decision.",
                shouldContinue: true
            },
            {
                perceive: "Have price, momentum, and technical levels.",
                decide: "Make final trading recommendation based on analysis.",
                act: "Request trading decision",
                request: "Based on this analysis, should I buy, sell, or hold BTC?",
                response: "Recommendation: HOLD with small BUY bias. Price has room to $70K resistance, but wait for a pullback to $66K for better entry. Set stop-loss at $64.5K.",
                context: "Decision: HOLD / small BUY on dip to $66K",
                reasoning: "Analysis complete. Clear recommendation with risk management.",
                shouldContinue: false
            }
        ],
        result: "Final Decision: HOLD, consider buying on pullback to $66K"
    }
};

// State machine states
const STATES = {
    IDLE: 'IDLE',
    PERCEIVING: 'PERCEIVING',
    DECIDING: 'DECIDING',
    ACTING: 'ACTING',
    WAITING: 'WAITING',
    PROCESSING: 'PROCESSING',
    EVALUATING: 'EVALUATING',
    DONE: 'DONE'
};

// Speed settings (delays in ms)
const SPEEDS = {
    slow: { perceive: 1200, decide: 1200, act: 800, wait: 1500, process: 1000, evaluate: 1000 },
    medium: { perceive: 700, decide: 700, act: 500, wait: 900, process: 600, evaluate: 600 },
    fast: { perceive: 350, decide: 350, act: 250, wait: 450, process: 300, evaluate: 300 }
};

class AgentSimulator {
    constructor() {
        this.currentScenario = SCENARIOS.math;
        this.currentState = STATES.IDLE;
        this.currentLoop = 0;
        this.isAutoPlay = false;
        this.isPaused = false;
        this.speed = 'medium';
        this.animationTimeout = null;

        this.initElements();
        this.initEventListeners();
        this.updateUI();
    }

    initElements() {
        // Components
        this.agentBox = document.getElementById('agent-box');
        this.llmBox = document.getElementById('llm-box');
        this.loopLogic = document.getElementById('loop-logic');
        this.arrowRequest = document.getElementById('arrow-request');
        this.arrowResponse = document.getElementById('arrow-response');
        this.arrowLabel = document.getElementById('arrow-label');

        // Agent internal components
        this.compPerceive = document.getElementById('comp-perceive');
        this.compDecide = document.getElementById('comp-decide');
        this.compAct = document.getElementById('comp-act');
        this.perceiveText = document.getElementById('perceive-text');
        this.decideText = document.getElementById('decide-text');
        this.actText = document.getElementById('act-text');

        // Decision indicator
        this.decisionIndicator = document.getElementById('decision-indicator');
        this.decisionContinue = document.getElementById('decision-continue');
        this.decisionStop = document.getElementById('decision-stop');

        // LLM status
        this.llmStatus = document.getElementById('llm-status');

        // Agent Mind panel
        this.mindGoal = document.getElementById('mind-goal');
        this.mindContext = document.getElementById('mind-context');
        this.mindReasoning = document.getElementById('mind-reasoning');

        // Status displays
        this.stateDot = document.getElementById('state-dot');
        this.currentStateEl = document.getElementById('current-state');
        this.loopCountEl = document.getElementById('loop-count');
        this.totalLoopsEl = document.getElementById('total-loops');
        this.loopStatusEl = document.getElementById('loop-status');
        this.messageLog = document.getElementById('message-log');

        // Controls
        this.modeSelect = document.getElementById('mode-select');
        this.speedControl = document.getElementById('speed-control');
        this.speedSelect = document.getElementById('speed-select');
        this.scenarioSelect = document.getElementById('scenario-select');
        this.btnStart = document.getElementById('btn-start');
        this.btnStep = document.getElementById('btn-step');
        this.btnPause = document.getElementById('btn-pause');
        this.btnReset = document.getElementById('btn-reset');
    }

    initEventListeners() {
        this.modeSelect.addEventListener('change', () => this.onModeChange());
        this.speedSelect.addEventListener('change', () => this.onSpeedChange());
        this.scenarioSelect.addEventListener('change', () => this.onScenarioChange());
        this.btnStart.addEventListener('click', () => this.start());
        this.btnStep.addEventListener('click', () => this.step());
        this.btnPause.addEventListener('click', () => this.togglePause());
        this.btnReset.addEventListener('click', () => this.reset());
    }

    onModeChange() {
        this.isAutoPlay = this.modeSelect.value === 'auto';
        this.speedControl.classList.toggle('hidden', !this.isAutoPlay);
        this.updateButtonVisibility();
    }

    onSpeedChange() {
        this.speed = this.speedSelect.value;
    }

    onScenarioChange() {
        const scenarioId = this.scenarioSelect.value;
        this.currentScenario = SCENARIOS[scenarioId];
        this.reset();
    }

    setState(newState) {
        this.currentState = newState;
        this.updateStateDisplay();
        this.updateComponentHighlights();
    }

    updateStateDisplay() {
        this.currentStateEl.textContent = this.currentState;

        // Update state dot
        this.stateDot.className = 'state-dot';
        switch (this.currentState) {
            case STATES.IDLE:
                this.stateDot.classList.add('idle');
                break;
            case STATES.PERCEIVING:
            case STATES.DECIDING:
            case STATES.ACTING:
                this.stateDot.classList.add('sending');
                break;
            case STATES.WAITING:
                this.stateDot.classList.add('waiting');
                break;
            case STATES.PROCESSING:
            case STATES.EVALUATING:
                this.stateDot.classList.add('processing');
                break;
            case STATES.DONE:
                this.stateDot.classList.add('done');
                break;
        }
    }

    resetComponentStyles() {
        // Reset agent components
        [this.compPerceive, this.compDecide, this.compAct].forEach(comp => {
            comp.classList.remove('border-cyan-500', 'border-yellow-500', 'border-green-500', 'bg-cyan-500/10', 'bg-yellow-500/10', 'bg-green-500/10');
            comp.classList.add('border-transparent');
        });

        // Reset boxes
        this.agentBox.classList.remove('active', 'component-active');
        this.llmBox.classList.remove('active', 'component-active');
        this.loopLogic.classList.remove('active', 'component-active');
        this.loopLogic.style.opacity = '0.5';

        // Reset arrows
        this.arrowRequest.classList.remove('arrow-flow-right');
        this.arrowResponse.classList.remove('arrow-flow-left');
        this.arrowRequest.style.opacity = '0.3';
        this.arrowResponse.style.opacity = '0.3';
        this.arrowLabel.textContent = 'text';

        // Reset LLM status
        this.llmStatus.classList.add('hidden');

        // Reset decision indicator
        this.decisionIndicator.classList.add('hidden');
        this.decisionContinue.classList.add('hidden');
        this.decisionStop.classList.add('hidden');
    }

    updateComponentHighlights() {
        this.resetComponentStyles();

        switch (this.currentState) {
            case STATES.PERCEIVING:
                this.agentBox.classList.add('active');
                this.compPerceive.classList.remove('border-transparent');
                this.compPerceive.classList.add('border-cyan-500', 'bg-cyan-500/10');
                break;

            case STATES.DECIDING:
                this.agentBox.classList.add('active');
                this.compDecide.classList.remove('border-transparent');
                this.compDecide.classList.add('border-yellow-500', 'bg-yellow-500/10');
                break;

            case STATES.ACTING:
                this.agentBox.classList.add('active');
                this.compAct.classList.remove('border-transparent');
                this.compAct.classList.add('border-green-500', 'bg-green-500/10');
                this.arrowRequest.classList.add('arrow-flow-right');
                this.arrowRequest.style.opacity = '1';
                break;

            case STATES.WAITING:
                this.llmBox.classList.add('active', 'component-active');
                this.llmStatus.classList.remove('hidden');
                break;

            case STATES.PROCESSING:
                this.arrowResponse.classList.add('arrow-flow-left');
                this.arrowResponse.style.opacity = '1';
                this.agentBox.classList.add('active');
                break;

            case STATES.EVALUATING:
                this.loopLogic.classList.add('active', 'component-active');
                this.loopLogic.style.opacity = '1';
                break;

            case STATES.DONE:
                this.loopLogic.style.opacity = '1';
                break;
        }
    }

    updateUI() {
        this.loopCountEl.textContent = this.currentLoop;
        this.totalLoopsEl.textContent = this.currentScenario.loops.length;
    }

    updateButtonVisibility() {
        const isRunning = this.currentState !== STATES.IDLE && this.currentState !== STATES.DONE;

        this.btnStart.classList.toggle('hidden', isRunning || this.currentState === STATES.DONE);
        this.btnStep.classList.toggle('hidden', this.isAutoPlay || !isRunning);
        this.btnPause.classList.toggle('hidden', !this.isAutoPlay || !isRunning);

        if (this.isPaused) {
            this.btnPause.textContent = 'Resume';
        } else {
            this.btnPause.textContent = 'Pause';
        }
    }

    updateMind(goal, context, reasoning) {
        if (goal !== null) this.mindGoal.textContent = goal;
        if (context !== null) this.mindContext.textContent = context;
        if (reasoning !== null) this.mindReasoning.textContent = reasoning;
    }

    addMessage(type, content) {
        const messageEl = document.createElement('div');
        messageEl.className = 'message-enter mb-2';

        let prefix, colorClass;
        switch (type) {
            case 'request':
                prefix = '→ Agent:';
                colorClass = 'text-blue-400';
                break;
            case 'response':
                prefix = '← LLM:';
                colorClass = 'text-purple-400';
                break;
            case 'perceive':
                prefix = '👁 Perceive:';
                colorClass = 'text-cyan-400';
                break;
            case 'decide':
                prefix = '💡 Decide:';
                colorClass = 'text-yellow-400';
                break;
            case 'act':
                prefix = '⚡ Act:';
                colorClass = 'text-green-400';
                break;
            case 'evaluate':
                prefix = '🔄 Evaluate:';
                colorClass = 'text-accent-glow';
                break;
            case 'result':
                prefix = '✓';
                colorClass = 'text-green-400 font-semibold';
                break;
            case 'goal':
                prefix = '🎯 Goal:';
                colorClass = 'text-yellow-400';
                break;
        }

        messageEl.innerHTML = `<span class="${colorClass}">${prefix}</span> <span class="text-gray-300">${this.escapeHtml(content)}</span>`;

        this.messageLog.appendChild(messageEl);
        this.messageLog.scrollTop = this.messageLog.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearMessages() {
        this.messageLog.innerHTML = '<div class="text-gray-500 italic">Starting simulation...</div>';
    }

    async delay(ms) {
        return new Promise(resolve => {
            this.animationTimeout = setTimeout(resolve, ms);
        });
    }

    async start() {
        this.clearMessages();
        this.currentLoop = 0;
        this.isPaused = false;
        this.updateUI();

        // Initialize mind panel
        this.updateMind(this.currentScenario.goal, 'Starting...', 'Analyzing goal...');

        // Show goal
        this.addMessage('goal', this.currentScenario.goal);
        await this.delay(500);

        if (this.isAutoPlay) {
            await this.autoPlay();
        } else {
            await this.executeStep();
        }
    }

    async step() {
        if (this.currentState === STATES.DONE) return;
        await this.executeStep();
    }

    async executeStep() {
        if (this.currentLoop >= this.currentScenario.loops.length) {
            this.finish();
            return;
        }

        const loopData = this.currentScenario.loops[this.currentLoop];
        const speeds = SPEEDS[this.speed];

        // PERCEIVING state
        this.setState(STATES.PERCEIVING);
        this.loopStatusEl.textContent = 'Perceiving environment...';
        this.perceiveText.textContent = loopData.perceive;
        this.updateMind(null, 'Gathering information...', null);
        this.addMessage('perceive', loopData.perceive);
        this.updateButtonVisibility();
        await this.delay(speeds.perceive);

        if (this.isPaused) return;

        // DECIDING state
        this.setState(STATES.DECIDING);
        this.loopStatusEl.textContent = 'Deciding next action...';
        this.decideText.textContent = loopData.decide;
        this.updateMind(null, null, loopData.decide);
        this.addMessage('decide', loopData.decide);
        await this.delay(speeds.decide);

        if (this.isPaused) return;

        // ACTING state
        this.setState(STATES.ACTING);
        this.loopStatusEl.textContent = 'Executing action...';
        this.actText.textContent = loopData.act;
        this.addMessage('act', loopData.act);
        await this.delay(speeds.act);

        if (this.isPaused) return;

        // Send request
        this.addMessage('request', loopData.request);
        await this.delay(speeds.act);

        if (this.isPaused) return;

        // WAITING state
        this.setState(STATES.WAITING);
        this.loopStatusEl.textContent = 'Waiting for LLM response...';
        await this.delay(speeds.wait);

        if (this.isPaused) return;

        // PROCESSING state
        this.setState(STATES.PROCESSING);
        this.loopStatusEl.textContent = 'Processing response...';
        this.addMessage('response', loopData.response);
        this.updateMind(null, loopData.context, null);
        await this.delay(speeds.process);

        if (this.isPaused) return;

        // EVALUATING state
        this.setState(STATES.EVALUATING);
        this.loopStatusEl.textContent = 'Evaluating: Is goal complete?';
        this.updateMind(null, null, loopData.reasoning);
        this.addMessage('evaluate', loopData.reasoning);
        await this.delay(speeds.evaluate);

        if (this.isPaused) return;

        // Show decision
        this.decisionIndicator.classList.remove('hidden');
        if (loopData.shouldContinue) {
            this.decisionContinue.classList.remove('hidden');
        } else {
            this.decisionStop.classList.remove('hidden');
        }
        await this.delay(speeds.evaluate);

        // Increment loop
        this.currentLoop++;
        this.updateUI();

        // Check if done
        if (this.currentLoop >= this.currentScenario.loops.length) {
            this.finish();
        } else {
            this.loopStatusEl.textContent = 'Goal not complete. Starting next iteration...';
            this.setState(STATES.IDLE);
            this.updateButtonVisibility();

            // Reset component texts for next loop
            this.perceiveText.textContent = 'Gather information';
            this.decideText.textContent = 'Plan next action';
            this.actText.textContent = 'Execute action';
        }
    }

    async autoPlay() {
        while (this.currentLoop < this.currentScenario.loops.length && !this.isPaused) {
            await this.executeStep();
            if (this.currentState !== STATES.DONE) {
                await this.delay(400);
            }
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.updateButtonVisibility();

        if (!this.isPaused && this.isAutoPlay) {
            this.autoPlay();
        }
    }

    finish() {
        this.setState(STATES.DONE);
        this.loopStatusEl.textContent = 'Task complete!';
        this.addMessage('result', this.currentScenario.result);
        this.updateMind(null, 'Task completed successfully', 'All objectives achieved. Agent stopping.');
        this.updateButtonVisibility();

        // Show final decision
        this.decisionIndicator.classList.remove('hidden');
        this.decisionContinue.classList.add('hidden');
        this.decisionStop.classList.remove('hidden');
    }

    reset() {
        // Clear any pending animations
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }

        this.currentLoop = 0;
        this.isPaused = false;
        this.setState(STATES.IDLE);
        this.loopStatusEl.textContent = 'Loop Logic: Check if task is complete';
        this.updateUI();
        this.updateButtonVisibility();

        // Reset component texts
        this.perceiveText.textContent = 'Gather information';
        this.decideText.textContent = 'Plan next action';
        this.actText.textContent = 'Execute action';

        // Reset mind panel
        this.updateMind('-', '-', '-');

        // Reset decision indicator
        this.decisionIndicator.classList.add('hidden');
        this.decisionContinue.classList.add('hidden');
        this.decisionStop.classList.add('hidden');

        this.messageLog.innerHTML = '<div class="text-gray-500 italic">Select a scenario and press Start to begin...</div>';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.agentSimulator = new AgentSimulator();
});

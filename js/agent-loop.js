/**
 * Agent Loop Interactive Simulator (Enhanced)
 * Demonstrates how AI agents work through a detailed loop visualization
 * showing the Perceive → Decide → Act cycle
 */

// Scenario definitions with detailed component breakdowns
// KEY: Only DECIDE calls the LLM. PERCEIVE and ACT are local operations.
const SCENARIOS = {
    math: {
        id: 'math',
        name: 'Simple Math',
        goal: 'Calculate (2+2) × 3',
        loops: [
            {
                // PERCEIVE: Local data gathering (no LLM)
                perceive: "Reading goal: need (2+2)×3. No previous results in memory.",
                // DECIDE: This IS the LLM call
                decide: "LLM decides: First compute 2+2, then multiply result by 3.",
                request: "I need to calculate (2+2)×3. What is 2+2?",
                response: "2 + 2 = 4",
                // ACT: Execute locally based on LLM's decision
                act: "Storing result '4' in memory for next step.",
                context: "Memory: first_result = 4",
                reasoning: "Have intermediate result. Need multiplication step.",
                shouldContinue: true
            },
            {
                perceive: "Reading memory: first_result = 4. Goal needs ×3.",
                decide: "LLM decides: Multiply stored result by 3 to complete goal.",
                request: "Now multiply 4 by 3 to complete the calculation.",
                response: "4 × 3 = 12. The calculation is complete.",
                act: "Storing final result '12'. Marking task complete.",
                context: "Memory: final_result = 12",
                reasoning: "Calculation complete. Goal achieved!",
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
                perceive: "Reading goal: need capital + population. Memory is empty.",
                decide: "LLM decides: First find the capital, then look up its population.",
                request: "What is the capital of France?",
                response: "The capital of France is Paris.",
                act: "Storing 'Paris' as capital in memory.",
                context: "Memory: capital = 'Paris'",
                reasoning: "Have capital. Still need population data.",
                shouldContinue: true
            },
            {
                perceive: "Reading memory: capital = 'Paris'. Population still needed.",
                decide: "LLM decides: Query population for the stored capital city.",
                request: "What is the population of Paris?",
                response: "Paris has a population of approximately 2.1 million in the city proper.",
                act: "Storing '2.1 million' as population in memory.",
                context: "Memory: capital = 'Paris', population = '2.1M'",
                reasoning: "Have both data points. Ready to compile answer.",
                shouldContinue: true
            },
            {
                perceive: "Reading memory: capital = 'Paris', population = '2.1M'. All data collected.",
                decide: "LLM decides: All info gathered. Format final answer.",
                request: "Compile: France's capital is Paris with population ~2.1 million.",
                response: "Complete: Paris is the capital of France with a population of ~2.1 million.",
                act: "Writing final answer to output. Task complete.",
                context: "Output ready: complete answer compiled",
                reasoning: "Answer compiled and verified. Task complete!",
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
                perceive: "Reading goal: write reverseString function. No code files yet.",
                decide: "LLM decides: Plan algorithm first, then implement.",
                request: "Plan an approach to reverse a string in JavaScript.",
                response: "Approach: Split string into array, reverse array, join back to string.",
                act: "Saving plan to notes: split → reverse → join",
                context: "Notes: algorithm = 'split, reverse, join'",
                reasoning: "Have a plan. Next step: write the code.",
                shouldContinue: true
            },
            {
                perceive: "Reading notes: algorithm planned. No code file exists yet.",
                decide: "LLM decides: Write the function using the planned approach.",
                request: "Write the reverseString function using split/reverse/join.",
                response: "function reverseString(str) {\n  return str.split('').reverse().join('');\n}",
                act: "Writing code to file: reverseString.js created.",
                context: "Files: reverseString.js (created)",
                reasoning: "Code written. Should test before confirming.",
                shouldContinue: true
            },
            {
                perceive: "Reading files: reverseString.js exists. Not tested yet.",
                decide: "LLM decides: Run test with sample input to verify.",
                request: "Test reverseString('hello') - what should it return?",
                response: "reverseString('hello') returns 'olleh'. Test passed!",
                act: "Running test locally... Output: 'olleh'. Test PASSED.",
                context: "Tests: 'hello' → 'olleh' ✓",
                reasoning: "Test passed. Function works correctly.",
                shouldContinue: true
            },
            {
                perceive: "Reading test results: all tests passing. Code complete.",
                decide: "LLM decides: Tests pass, code is correct. Task complete.",
                request: "Confirm the reverseString function is complete and working.",
                response: "Confirmed: reverseString function works correctly for all string inputs.",
                act: "Marking task as DONE. No further action needed.",
                context: "Status: COMPLETE",
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
                perceive: "Reading goal: need trading decision. Checking price API...",
                decide: "LLM decides: Need current price and trend data first.",
                request: "Analyze BTC: what's the current price and 24h trend?",
                response: "BTC is at $67,500, up 3.2% in 24h. RSI at 58, moderate bullish momentum.",
                act: "Calling price API... Storing: price=$67.5K, change=+3.2%, RSI=58",
                context: "Data: price=$67.5K, 24h=+3.2%, RSI=58",
                reasoning: "Have price data. Need support/resistance levels.",
                shouldContinue: true
            },
            {
                perceive: "Reading stored data: $67.5K, +3.2%, RSI 58. Need technicals.",
                decide: "LLM decides: Analyze support/resistance for risk assessment.",
                request: "What are BTC's key support and resistance levels?",
                response: "Support at $65,000, resistance at $70,000. Mid-range with room to move.",
                act: "Storing levels: support=$65K, resistance=$70K",
                context: "Data: support=$65K, resistance=$70K, current=$67.5K",
                reasoning: "Have all data. Ready to make decision.",
                shouldContinue: true
            },
            {
                perceive: "Reading all data: $67.5K (mid-range), bullish momentum, clear levels.",
                decide: "LLM decides: HOLD with buy bias. Wait for better entry.",
                request: "Based on: price $67.5K, RSI 58, support $65K, resistance $70K - recommendation?",
                response: "HOLD with small BUY bias. Wait for pullback to $66K for better entry. Stop-loss at $64.5K.",
                act: "Logging recommendation: HOLD, buy on dip to $66K, stop at $64.5K",
                context: "Decision: HOLD / BUY at $66K / Stop $64.5K",
                reasoning: "Analysis complete. Clear actionable recommendation.",
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
            this.perceiveText.textContent = 'Gather context locally';
            this.decideText.textContent = 'Ask LLM what to do';
            this.actText.textContent = 'Execute tool/action';
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
        this.perceiveText.textContent = 'Gather context locally';
        this.decideText.textContent = 'Ask LLM what to do';
        this.actText.textContent = 'Execute tool/action';

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

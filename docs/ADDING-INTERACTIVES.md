# Adding New Interactives

This guide walks through creating a new interactive visualization.

## Step 1: Plan Your Concept

Before coding, answer:
1. **What concept are you teaching?**
2. **What's the simplest visual that explains it?**
3. **What interactions will users have?**
4. **What scenarios or examples will you include?**

## Step 2: Create the Folder Structure

```bash
mkdir -p interactives/your-concept-name
touch interactives/your-concept-name/index.html
touch js/your-concept-name.js
```

## Step 3: Create the HTML Page

Use this template:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Concept - TechExplain</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        dark: {
                            900: '#0a0a0f',
                            800: '#12121a',
                            700: '#1a1a24',
                            600: '#24242f',
                        },
                        accent: {
                            primary: '#6366f1',
                            secondary: '#8b5cf6',
                            glow: '#818cf8',
                        }
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="../../css/styles.css">
</head>
<body class="bg-dark-900 text-gray-100 min-h-screen">
    <!-- Header -->
    <header class="border-b border-dark-700">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="../../index.html" class="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                <span>Back to Home</span>
            </a>
            <span class="text-sm text-gray-500">TechExplain</span>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-6 py-8">
        <!-- Title -->
        <div class="text-center mb-8">
            <h1 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Your Concept Title
            </h1>
            <p class="text-gray-400 max-w-2xl mx-auto">
                Brief description of what users will learn.
            </p>
        </div>

        <!-- Visualization Area -->
        <div class="bg-dark-800 rounded-2xl border border-dark-600 overflow-hidden mb-6">
            <!-- Your visualization goes here -->
        </div>

        <!-- Explanation Section -->
        <div class="bg-dark-800 rounded-2xl border border-dark-600 p-6 md:p-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-100">How It Works</h2>
            <!-- Explanation content -->
        </div>
    </main>

    <!-- Footer -->
    <footer class="max-w-6xl mx-auto px-6 py-8 text-center">
        <a href="../../index.html" class="text-accent-primary hover:text-accent-glow transition-colors text-sm">
            ← Back to all interactives
        </a>
    </footer>

    <script src="../../js/your-concept-name.js"></script>
</body>
</html>
```

## Step 4: Create the JavaScript

Use this class template:

```javascript
// Scenario/data definitions
const SCENARIOS = {
    basic: {
        id: 'basic',
        name: 'Basic Example',
        // ... scenario-specific data
    }
};

// State definitions
const STATES = {
    IDLE: 'IDLE',
    RUNNING: 'RUNNING',
    DONE: 'DONE'
};

class YourConceptSimulator {
    constructor() {
        this.currentScenario = SCENARIOS.basic;
        this.currentState = STATES.IDLE;

        this.initElements();
        this.initEventListeners();
        this.updateUI();
    }

    initElements() {
        // Cache DOM elements
        this.someElement = document.getElementById('some-element');
    }

    initEventListeners() {
        // Bind event handlers
        document.getElementById('start-btn').addEventListener('click', () => this.start());
    }

    setState(newState) {
        this.currentState = newState;
        this.updateUI();
    }

    updateUI() {
        // Update visual state
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async start() {
        this.setState(STATES.RUNNING);
        // Animation logic
    }

    reset() {
        this.setState(STATES.IDLE);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.simulator = new YourConceptSimulator();
});
```

## Step 5: Add to Landing Page

Edit `index.html` to add a card in the "Latest Interactive" or create a new section:

```html
<a href="interactives/your-concept/index.html" class="block group">
    <div class="bg-dark-800 rounded-2xl p-8 border border-dark-600 hover:border-accent-primary/50 transition-all">
        <!-- Card content -->
    </div>
</a>
```

## Step 6: Test

1. Open in browser
2. Test all scenarios
3. Test step-by-step mode
4. Test auto-play mode
5. Test reset
6. Check mobile responsiveness
7. Verify back navigation works

## Naming Conventions

- **Folders**: lowercase with hyphens (`agent-loop`, `how-https-works`)
- **JS files**: match folder name (`agent-loop.js`)
- **CSS classes**: BEM-style where needed, otherwise Tailwind utilities
- **JS classes**: PascalCase (`AgentSimulator`)
- **JS constants**: SCREAMING_SNAKE_CASE (`STATES`, `SCENARIOS`)

## Best Practices

1. **Keep it simple**: One core concept per interactive
2. **Progressive disclosure**: Start with basics, reveal complexity
3. **Clear feedback**: Users should always know the current state
4. **Accessibility**: Use semantic HTML, proper contrast
5. **Mobile-first**: Test on small screens early
6. **Performance**: Avoid heavy animations on mobile

## Checklist

- [ ] Folder and files created
- [ ] HTML follows template structure
- [ ] JavaScript uses class pattern
- [ ] At least 2 scenarios defined
- [ ] Step-by-step mode works
- [ ] Auto-play mode works
- [ ] Reset clears all state
- [ ] Mobile responsive
- [ ] Added to landing page
- [ ] Documentation updated

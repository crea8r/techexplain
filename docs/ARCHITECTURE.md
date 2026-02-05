# Architecture

## Folder Structure

```
techexplain/
├── index.html              # Landing page - entry point
├── interactives/           # Each interactive gets its own folder
│   └── agent-loop/
│       └── index.html      # Self-contained interactive page
├── css/
│   └── styles.css          # Shared custom styles & animations
├── js/
│   └── agent-loop.js       # Interactive-specific logic
├── assets/                 # Shared images, icons (if needed)
└── docs/                   # Project documentation
```

## Design Decisions

### Static Site
No build step, no frameworks. Benefits:
- Zero dependencies to maintain
- Works offline
- Easy to host anywhere
- Simple to understand and modify

### Tailwind via CDN
Using `https://cdn.tailwindcss.com` with inline config:
- No build process needed
- Full Tailwind functionality
- Custom theme via inline script

### Self-Contained Interactives
Each interactive is a standalone HTML file that:
- Links to shared CSS for animations
- Has its own dedicated JS file
- Can work independently if needed

## Page Architecture

### Landing Page (`index.html`)
- Hero section with branding
- "What is this?" explanation
- Cards linking to interactives
- Footer with credits

### Interactive Pages
Standard structure:
1. Header with back navigation
2. Title and concept introduction
3. Visualization area
4. Message/output log
5. Controls (mode, speed, scenario)
6. "How it works" explanation
7. Footer with navigation

## JavaScript Patterns

### Class-Based Simulators
Each interactive uses a class to manage state:

```javascript
class InteractiveSimulator {
    constructor() {
        this.initElements();      // Cache DOM elements
        this.initEventListeners(); // Bind events
        this.updateUI();           // Initial render
    }

    // State management
    setState(newState) { }

    // Core actions
    start() { }
    step() { }
    reset() { }

    // UI updates
    updateUI() { }
    updateButtonVisibility() { }
}
```

### State Machine Pattern
Interactives use explicit states:
```
IDLE → SENDING → WAITING → PROCESSING → DONE
         ↑___________________________|  (loop)
```

### Async/Await for Animations
Delays and transitions use promises:
```javascript
async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async executeStep() {
    this.setState(STATES.SENDING);
    await this.delay(1000);
    this.setState(STATES.WAITING);
    // ...
}
```

## CSS Architecture

### Tailwind for Layout
All layout, spacing, colors, and typography use Tailwind utilities.

### Custom CSS for Animations
`css/styles.css` contains:
- Keyframe animations (pulse, flow, typing)
- Component state classes (`.active`, `.component-active`)
- Scrollbar styling
- Button hover effects

### CSS Custom Properties
Colors are defined in Tailwind config, but could be extended with CSS variables for more dynamic theming.

## Data Flow

```
User Input → Event Handler → State Update → UI Update
                                    ↓
                            Animation/Delay
                                    ↓
                            Next State (or DONE)
```

## Extending the System

### Adding a New Interactive

1. Create folder: `interactives/new-concept/`
2. Create `index.html` using existing template
3. Create `js/new-concept.js` with simulator class
4. Add card to landing page
5. Update documentation

See [ADDING-INTERACTIVES.md](ADDING-INTERACTIVES.md) for details.

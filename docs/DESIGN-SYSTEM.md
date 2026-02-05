# Design System

Visual design guidelines for TechExplain interactives.

## Color Palette

### Background Colors
```
dark-900: #0a0a0f  (page background)
dark-800: #12121a  (card background)
dark-700: #1a1a24  (component background)
dark-600: #24242f  (borders, dividers)
```

### Accent Colors
```
primary:   #6366f1  (indigo - main accent)
secondary: #8b5cf6  (purple - secondary accent)
glow:      #818cf8  (light indigo - highlights, hover states)
```

### Text Colors
```
gray-100: Primary text (headings, important content)
gray-300: Body text
gray-400: Secondary text (descriptions)
gray-500: Muted text (captions, hints)
```

### State Colors
```
blue-400:   Request/Agent actions
purple-400: Response/LLM actions
yellow-400: Goals, warnings
green-400:  Success, completion
gray-500:   Idle, inactive
```

## Typography

### Font Stack
System fonts via Tailwind defaults:
```css
font-family: ui-sans-serif, system-ui, sans-serif;
```

### Monospace (for code/logs)
```css
font-family: ui-monospace, monospace;
```

### Scale
```
text-xs:   0.75rem  (labels, badges)
text-sm:   0.875rem (body text, controls)
text-base: 1rem     (standard body)
text-xl:   1.25rem  (section headers)
text-2xl:  1.5rem   (page headers)
text-3xl:  1.875rem (hero titles mobile)
text-4xl:  2.25rem  (hero titles desktop)
text-5xl:  3rem     (landing hero)
```

## Spacing

Use Tailwind's spacing scale:
```
p-4, p-6, p-8    (padding)
gap-2, gap-4, gap-6 (flex/grid gaps)
mb-2, mb-4, mb-6 (margins)
```

### Common Patterns
- Card padding: `p-6` (mobile) / `p-8` (desktop)
- Section spacing: `py-8` or `py-12`
- Component gaps: `gap-4` or `gap-6`

## Components

### Cards
```html
<div class="bg-dark-800 rounded-2xl border border-dark-600 p-6">
    <!-- content -->
</div>
```

Hover state (interactive cards):
```html
<div class="... hover:border-accent-primary/50 transition-all">
```

### Buttons

Primary:
```html
<button class="btn-primary px-6 py-2 rounded-lg font-medium text-white">
    Action
</button>
```

Secondary:
```html
<button class="btn-secondary px-6 py-2 rounded-lg font-medium text-gray-300">
    Action
</button>
```

### Form Controls
```html
<select class="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent-primary">
    <option>Option</option>
</select>
```

### State Indicators
```html
<div class="state-indicator bg-dark-700 rounded-lg px-4 py-2">
    <span class="state-dot idle"></span>
    <span class="text-gray-400">State: <span class="text-gray-100">IDLE</span></span>
</div>
```

### Message Log
```html
<div class="message-log bg-dark-900 rounded-lg p-4 h-48 overflow-y-auto font-mono text-sm">
    <!-- messages -->
</div>
```

## Animations

### Pulse Glow (active components)
```css
@keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
}
```

### Fade In (new elements)
```css
@keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
```

### Flow (data transfer arrows)
```css
@keyframes flow-right {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
}
```

### Usage
Apply via classes defined in `css/styles.css`:
- `.component-active` - pulsing glow
- `.message-enter` - fade in
- `.arrow-flow-right` - data flow animation

## Icons

Using inline SVGs from Heroicons (outline style):
```html
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="..."></path>
</svg>
```

Common icons:
- Arrow left (back): `M10 19l-7-7m0 0l7-7m-7 7h18`
- Loop/refresh: `M4 4v5h.582m15.356 2A8.001...`
- Computer: `M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2...`
- Light bulb: `M9.663 17h4.673M12 3v1m6.364...`

## Responsive Design

### Breakpoints
```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
```

### Common Patterns

Stack to row:
```html
<div class="flex flex-col md:flex-row">
```

Responsive text:
```html
<h1 class="text-3xl md:text-4xl">
```

Responsive padding:
```html
<div class="p-6 md:p-8">
```

### Mobile Considerations
- Touch targets minimum 44x44px
- Reduce animation complexity
- Stack components vertically
- Hide non-essential controls
- Ensure readable font sizes

## Accessibility

### Contrast
All text meets WCAG AA standards:
- gray-100 on dark-800: ✓
- gray-400 on dark-800: ✓
- accent-glow on dark-800: ✓

### Focus States
Form controls have visible focus:
```html
focus:outline-none focus:border-accent-primary
```

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<main>`, `<header>`, `<footer>`
- Use `<button>` for actions, `<a>` for navigation

### Motion
Respect reduced motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

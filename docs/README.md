# TechExplain - Project Documentation

## Overview

TechExplain is a collection of interactive visualizations designed to teach technology concepts. Instead of reading static articles, users learn by interacting with visual simulations.

## Philosophy

- **Show, don't tell**: Visual demonstrations over text explanations
- **Progressive complexity**: Start simple, add depth through interaction
- **No barriers**: No signup, no installation, just open and learn

## Getting Started

### Local Development

Simply open `index.html` in a browser. No build process required.

```bash
# Option 1: Direct file
open index.html

# Option 2: Local server (recommended for development)
python -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment

The site is fully static. Deploy to any static hosting:

- GitHub Pages
- Netlify
- Vercel
- Any web server

Just upload the files - no configuration needed.

## Current Interactives

### How AI Agents Work
**Location**: `interactives/agent-loop/`

Demonstrates the core loop that powers AI agents:
1. Agent sends text to LLM
2. LLM responds
3. Agent decides: continue or stop?

Features:
- 3 pre-defined scenarios
- Step-by-step or auto-play modes
- Visual state machine

## Adding New Content

See [ADDING-INTERACTIVES.md](ADDING-INTERACTIVES.md) for a guide on creating new interactives.

## Contributing

1. Fork the repository
2. Create a new interactive following the guide
3. Submit a pull request

## Future Ideas

- How Databases Index Data
- How HTTPS Works
- How Git Branches Work
- How DNS Resolution Works

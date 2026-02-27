# Beyond Chatbots: Shipping Stateful AI Agents on AWS

Standalone HTML presentation (30 min + 15 min Q&A) about stateful AI agents — concepts, ai-secure.dev as practical example, production patterns.

## Run

```bash
npm run serve
```

Open http://localhost:53542. Use arrow keys to navigate.

## Build Standalone HTML

```bash
node build-standalone.js
```

Produces `presentation-standalone.html` (~3 MB) with all images base64-embedded and highlight.js inlined. Zero external dependencies — share as a single file.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Presentation engine — slide renderer, navigation |
| `content.js` | Slide data — titles, bullets, code, SVGs. Edit slides here |
| `build-standalone.js` | Builds self-contained HTML with embedded assets |

Content and view are separated: change wording in `content.js`; adjust layout/styling in `index.html`.

## Content Overview

- **AI Agent Concepts** — LLM + tools + memory + control loop; MCP; sub-agents; skills
- **ai-secure.dev** — problem, user flow, architecture, toolbox, local to cloud
- **Production Patterns** — challenges, cost + reliability knobs, takeaway
- **Wrap-up** — takeaways, resources, Q&A

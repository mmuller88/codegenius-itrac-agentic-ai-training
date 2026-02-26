# Beyond Chatbots: Shipping Stateful AI Agents on AWS

Standalone HTML presentation (30 min + 15 min Q&A) about stateful AI agents, MCP, sub-agents, skills, and AWS Bedrock AgentCore. Built with Reveal.js + Tailwind CSS.

## Run

```bash
npm run serve
```

Open http://localhost:53542. Use arrow keys to navigate.

## Structure

| File | Purpose |
|------|---------|
| `index.html` | Presentation engine — Reveal.js, Tailwind, slide renderer |
| `content.js` | Slide data — titles, bullets, code, SVGs. Edit slides here |

Content and view are separated: change wording in `content.js`; adjust layout/styling in `index.html`.

## Content Overview

- **AI Agent Concepts** — LLM + tools + memory + control loop; MCP; sub-agents; skills
- **Why Infrastructure Matters** — state, tool orchestration, browser runtime, scaling
- **AWS Bedrock AgentCore** — Fargate for agents; ai-secure.dev walkthrough
- **Hard Lessons & Economics** — Docker parity, error handling, IaC, cost optimization

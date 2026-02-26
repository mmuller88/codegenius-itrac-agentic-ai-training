/**
 * Beyond Chatbots: Shipping Stateful AI Agents on AWS
 * Slide content - 30 min presentation + 15 min Q&A
 */
const SLIDES = [
  // --- Part 1: AI Agent Concepts ---
  {
    id: "title",
    section: "Intro",
    title: "Beyond Chatbots",
    subtitle: "Shipping Stateful AI Agents on AWS",
    layout: "title",
  },
  {
    id: "agenda",
    section: "Intro",
    title: "Agenda",
    bullets: [
      "AI Agent Concepts — LLM, tools, memory, control loop, MCP, sub-agents, skills",
      "Why Infrastructure Matters — the prototype-to-production gap",
      "AWS Bedrock AgentCore — Fargate for agents, ai-secure.dev walkthrough",
      "Hard Lessons & Economics — Docker parity, error handling, IaC, cost optimization",
      "Q&A — 15 min",
    ],
    layout: "default",
  },
  {
    id: "what-is-agent",
    section: "AI Agent Concepts",
    title: "What is an AI Agent?",
    subtitle: "More than a chatbot",
    bullets: [
      "LLM — reasoning & generation",
      "Tools — call functions, APIs, browse",
      "Memory — short-term (conversation) + long-term (persistent)",
      "Control Loop — observe → reason → act",
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 120" class="w-full max-w-lg mx-auto">
      <rect x="10" y="30" width="90" height="55" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="55" y="62" text-anchor="middle" fill="#1e40af" font-size="14" font-weight="600">LLM</text>
      <rect x="125" y="30" width="90" height="55" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="170" y="62" text-anchor="middle" fill="#1e40af" font-size="14" font-weight="600">Tools</text>
      <rect x="240" y="30" width="90" height="55" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="285" y="62" text-anchor="middle" fill="#1e40af" font-size="14" font-weight="600">Memory</text>
      <rect x="355" y="30" width="90" height="55" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="400" y="62" text-anchor="middle" fill="#1e40af" font-size="14" font-weight="600">Loop</text>
      <path d="M100 57 L120 57" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-what)"/>
      <path d="M215 57 L235 57" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-what)"/>
      <path d="M330 57 L350 57" stroke="#64748b" stroke-width="2" marker-end="url(#arrow-what)"/>
      <defs><marker id="arrow-what" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker></defs>
    </svg>`,
    layout: "diagram",
  },
  {
    id: "agent-loop",
    section: "AI Agent Concepts",
    title: "The Agent Loop",
    subtitle: "Observe → Reason → Act",
    bullets: [
      "Observe: perceive environment, tool results, user input",
      "Reason: decide next action (reply, call tool, delegate)",
      "Act: execute tool, update state, respond",
      "Loop until task complete",
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100" class="w-full max-w-md mx-auto">
      <rect x="10" y="30" width="85" height="40" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="52" y="55" text-anchor="middle" fill="#1e40af" font-size="13" font-weight="600">Observe</text>
      <rect x="115" y="30" width="90" height="40" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="160" y="55" text-anchor="middle" fill="#1e40af" font-size="13" font-weight="600">Reason</text>
      <rect x="225" y="30" width="85" height="40" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="267" y="55" text-anchor="middle" fill="#1e40af" font-size="13" font-weight="600">Act</text>
      <path d="M95 50 L110 50" stroke="#64748b" stroke-width="2" marker-end="url(#arr-loop)"/>
      <path d="M205 50 L220 50" stroke="#64748b" stroke-width="2" marker-end="url(#arr-loop)"/>
      <path d="M267 70 L267 85 L52 85 L52 70" stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#arr-loop)" stroke-dasharray="4 2"/>
      <defs><marker id="arr-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker></defs>
    </svg>`,
    layout: "diagram",
  },
  {
    id: "agents-vs-chat-vs-rag",
    section: "AI Agent Concepts",
    title: "Agents vs Chatbots vs RAG",
    subtitle: "Different paradigms",
    layout: "three-column",
    cols: [
      {
        title: "Chatbot",
        bullets: ["Single turn (mostly)", "No tools", "Stateless", "Simple orchestration", "Ex: customer FAQ bot, ChatGPT without tools"],
      },
      {
        title: "RAG",
        bullets: ["Retrieval-Augmented Generation", "No tools (doc retrieval only)", "Stateless", "Fixed retrieval flow", "Ex: search over company docs, Notion AI"],
      },
      {
        title: "Agent",
        bullets: ["Multi-turn, loops", "Tools + external actions", "Stateful (memory)", "Autonomous decisions", "Ex: Cursor, Claude Code, ai-secure.dev"],
      },
    ],
  },
  {
    id: "tool-use",
    section: "AI Agent Concepts",
    title: "Tool Use",
    subtitle: "How an agent calls functions — example flow",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 340" class="w-full max-w-2xl mx-auto">
      <!-- Participants -->
      <rect x="30" y="10" width="70" height="30" rx="4" fill="#2563eb" fill-opacity="0.15" stroke="#2563eb" stroke-width="1.5"/>
      <text x="65" y="30" text-anchor="middle" fill="#1e40af" font-size="12" font-weight="600">User</text>
      <rect x="180" y="10" width="80" height="30" rx="4" fill="#f59e0b" fill-opacity="0.15" stroke="#d97706" stroke-width="1.5"/>
      <text x="220" y="30" text-anchor="middle" fill="#b45309" font-size="12" font-weight="600">Runtime</text>
      <rect x="345" y="10" width="70" height="30" rx="4" fill="#2563eb" fill-opacity="0.15" stroke="#2563eb" stroke-width="1.5"/>
      <text x="380" y="30" text-anchor="middle" fill="#1e40af" font-size="12" font-weight="600">LLM</text>
      <rect x="510" y="10" width="70" height="30" rx="4" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-width="1.5"/>
      <text x="545" y="30" text-anchor="middle" fill="#047857" font-size="12" font-weight="600">Tool</text>

      <!-- Lifelines -->
      <line x1="65" y1="40" x2="65" y2="330" stroke="#d1d5db" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="220" y1="40" x2="220" y2="330" stroke="#d1d5db" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="380" y1="40" x2="380" y2="330" stroke="#d1d5db" stroke-width="1" stroke-dasharray="4 3"/>
      <line x1="545" y1="40" x2="545" y2="330" stroke="#d1d5db" stroke-width="1" stroke-dasharray="4 3"/>

      <!-- 1: User -> Runtime -->
      <line x1="65" y1="70" x2="215" y2="70" stroke="#374151" stroke-width="1.5" marker-end="url(#seq-arr)"/>
      <text x="140" y="64" text-anchor="middle" fill="#374151" font-size="10">"Check example.com security"</text>

      <!-- 2: Runtime -> LLM -->
      <line x1="220" y1="100" x2="375" y2="100" stroke="#374151" stroke-width="1.5" marker-end="url(#seq-arr)"/>
      <text x="297" y="94" text-anchor="middle" fill="#374151" font-size="10">prompt + tool schemas</text>

      <!-- 3: LLM -> Runtime (tool call) -->
      <line x1="375" y1="140" x2="225" y2="140" stroke="#2563eb" stroke-width="1.5" marker-end="url(#seq-arr-blue)"/>
      <text x="300" y="134" text-anchor="middle" fill="#1e40af" font-size="10" font-weight="500">tool_call: http_security_check</text>

      <!-- 4: Runtime -> Tool -->
      <line x1="220" y1="170" x2="540" y2="170" stroke="#059669" stroke-width="1.5" marker-end="url(#seq-arr-green)"/>
      <text x="380" y="164" text-anchor="middle" fill="#047857" font-size="10">execute(url: "example.com")</text>

      <!-- 5: Tool -> Runtime (result) -->
      <line x1="540" y1="200" x2="225" y2="200" stroke="#059669" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#seq-arr-green)"/>
      <text x="380" y="194" text-anchor="middle" fill="#047857" font-size="10">{ headers: ..., tls: "1.3" }</text>

      <!-- 6: Runtime -> LLM (with result) -->
      <line x1="220" y1="235" x2="375" y2="235" stroke="#374151" stroke-width="1.5" marker-end="url(#seq-arr)"/>
      <text x="297" y="229" text-anchor="middle" fill="#374151" font-size="10">tool result</text>

      <!-- 7: LLM -> Runtime (final answer) -->
      <line x1="375" y1="270" x2="225" y2="270" stroke="#2563eb" stroke-width="1.5" marker-end="url(#seq-arr-blue)"/>
      <text x="300" y="264" text-anchor="middle" fill="#1e40af" font-size="10" font-weight="500">response (or next tool_call)</text>

      <!-- 8: Runtime -> User -->
      <line x1="220" y1="300" x2="70" y2="300" stroke="#374151" stroke-width="1.5" marker-end="url(#seq-arr)"/>
      <text x="145" y="294" text-anchor="middle" fill="#374151" font-size="10">stream result to user</text>

      <!-- Loop bracket -->
      <rect x="175" y="120" width="250" height="165" rx="3" fill="none" stroke="#9ca3af" stroke-width="1" stroke-dasharray="3 2"/>
      <text x="180" y="132" fill="#6b7280" font-size="9" font-weight="600">LOOP</text>

      <defs>
        <marker id="seq-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#374151"/></marker>
        <marker id="seq-arr-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#2563eb"/></marker>
        <marker id="seq-arr-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#059669"/></marker>
      </defs>
    </svg>`,
    layout: "diagram",
  },
  {
    id: "mcp",
    section: "AI Agent Concepts",
    title: "MCP — Model Context Protocol",
    subtitle: "Universal tool interface built on JSON-RPC 2.0",
    bullets: [
      "Open protocol — any host can talk to any MCP server",
      "Transport: stdio (local) or HTTP+SSE (remote)",
      "JSON-RPC 2.0 messages: method + params → result",
      "Servers expose tools, resources, prompts",
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 50" class="w-full max-w-lg mx-auto">
      <rect x="10" y="8" width="80" height="34" rx="5" fill="#f59e0b" fill-opacity="0.15" stroke="#d97706" stroke-width="1.5"/>
      <text x="50" y="30" text-anchor="middle" fill="#b45309" font-size="11" font-weight="600">Host App</text>
      <rect x="120" y="8" width="90" height="34" rx="5" fill="#2563eb" fill-opacity="0.15" stroke="#2563eb" stroke-width="1.5"/>
      <text x="165" y="30" text-anchor="middle" fill="#1e40af" font-size="11" font-weight="600">MCP Client</text>
      <rect x="250" y="8" width="90" height="34" rx="5" fill="#2563eb" fill-opacity="0.15" stroke="#2563eb" stroke-width="1.5"/>
      <text x="295" y="30" text-anchor="middle" fill="#1e40af" font-size="11" font-weight="600">MCP Server</text>
      <rect x="370" y="8" width="80" height="34" rx="5" fill="#059669" fill-opacity="0.15" stroke="#059669" stroke-width="1.5"/>
      <text x="410" y="30" text-anchor="middle" fill="#047857" font-size="11" font-weight="600">Tools</text>
      <path d="M90 25 L115 25" stroke="#64748b" stroke-width="1.5" marker-end="url(#mcp-arr)"/>
      <path d="M210 25 L245 25" stroke="#64748b" stroke-width="1.5" marker-end="url(#mcp-arr)"/>
      <text x="228" y="5" text-anchor="middle" fill="#6b7280" font-size="8">JSON-RPC</text>
      <path d="M340 25 L365 25" stroke="#64748b" stroke-width="1.5" marker-end="url(#mcp-arr)"/>
      <defs><marker id="mcp-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker></defs>
    </svg>`,
    layout: "diagram",
  },
  {
    id: "mcp-jsonrpc",
    section: "AI Agent Concepts",
    title: "MCP — JSON-RPC in Action",
    subtitle: "Client discovers tools, then calls them",
    layout: "two-column",
    cols: [
      {
        title: "1. Discover tools",
        codeBlocks: [
          {
            label: "Request",
            lang: "json",
            text: `{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}`,
          },
          {
            label: "Response",
            lang: "json",
            text: `{
  "result": {
    "tools": [
      { "name": "dns_lookup",
        "inputSchema": { ... } },
      { "name": "browser_navigate" }
    ]
  }
}`,
          },
        ],
      },
      {
        title: "2. Call a tool",
        codeBlocks: [
          {
            label: "Request",
            lang: "json",
            text: `{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "dns_lookup",
    "arguments": {
      "domain": "example.com"
    }
  }
}`,
          },
          {
            label: "Response",
            lang: "json",
            text: `{
  "result": {
    "content": [{
      "type": "text",
      "text": "SPF: v=spf1 ..."
    }]
  }
}`,
          },
        ],
      },
    ],
  },
  {
    id: "mcp-why",
    section: "AI Agent Concepts",
    title: "Why MCP Matters",
    subtitle: "Making APIs AI-ready",
    layout: "two-column",
    cols: [
      {
        title: "For companies",
        bullets: [
          "Wrap existing REST/GraphQL as MCP server",
          "Any AI agent can use your API instantly",
          "One integration, every LLM host benefits",
          "Stripe, GitHub, Slack already ship MCP servers",
        ],
      },
      {
        title: "For agent builders",
        bullets: [
          "No custom integrations per API",
          "Drop in MCP server = new capability",
          "Community servers: DB, browser, files, ...",
          "Same protocol local (stdio) and remote (HTTP+SSE)",
        ],
      },
    ],
  },
  {
    id: "sub-agents",
    section: "AI Agent Concepts",
    title: "Sub-Agents",
    subtitle: "Orchestration & delegation",
    bullets: [
      "Parent agent delegates to specialized child agents",
      "E.g. research agent → summarizer agent → writer agent",
      "Reduces context size, improves focus",
      "Orchestrator chooses which sub-agent for which task",
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 150" class="w-full max-w-lg mx-auto">
      <rect x="150" y="10" width="120" height="45" rx="8" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="210" y="38" text-anchor="middle" fill="#1e40af" font-size="13" font-weight="600">Orchestrator</text>
      <rect x="10" y="100" width="110" height="40" rx="6" fill="#059669" fill-opacity="0.2" stroke="#059669" stroke-width="2"/>
      <text x="65" y="124" text-anchor="middle" fill="#047857" font-size="11" font-weight="600">Research Agent</text>
      <rect x="155" y="100" width="110" height="40" rx="6" fill="#059669" fill-opacity="0.2" stroke="#059669" stroke-width="2"/>
      <text x="210" y="124" text-anchor="middle" fill="#047857" font-size="11" font-weight="600">Summarizer</text>
      <rect x="300" y="100" width="110" height="40" rx="6" fill="#059669" fill-opacity="0.2" stroke="#059669" stroke-width="2"/>
      <text x="355" y="124" text-anchor="middle" fill="#047857" font-size="11" font-weight="600">Writer Agent</text>
      <path d="M185 55 L65 95" stroke="#64748b" stroke-width="2" marker-end="url(#sub-arr)"/>
      <path d="M210 55 L210 95" stroke="#64748b" stroke-width="2" marker-end="url(#sub-arr)"/>
      <path d="M235 55 L355 95" stroke="#64748b" stroke-width="2" marker-end="url(#sub-arr)"/>
      <defs><marker id="sub-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker></defs>
    </svg>`,
    layout: "diagram",
  },
  {
    id: "agent-skills",
    section: "AI Agent Concepts",
    title: "Agent Skills",
    subtitle: "Reusable capability packages",
    bullets: [
      "Packaged bundles of tools + instructions + prompts",
      "Install via skills.sh — community skill registry",
      "Agent gets domain expertise it didn't have before",
      "Without skills: you prompt-engineer everything yourself",
      "With skills: agent reads SKILL.md, knows best practices",
    ],
    code: {
      lang: "bash",
      text: `# Install from skills.sh
npx skills install seo-audit

# Installed skill structure:
#  SKILL.md    agent instructions
#  tools/      MCP server defs
#  examples/   usage samples`,
    },
    layout: "two-column",
  },
  {
    id: "memory",
    section: "AI Agent Concepts",
    title: "Memory",
    subtitle: "Short-term vs long-term",
    layout: "two-column",
    cols: [
      {
        title: "Short-term",
        bullets: [
          "Conversation context (recent messages)",
          "Stored in-memory / session",
          "Lost when session ends",
          "AgentCore: built-in memory API",
        ],
      },
      {
        title: "Long-term",
        bullets: [
          "Persists across sessions",
          "Vector DB: Pinecone, pgvector, OpenSearch (e.g. past conversations, related docs)",
          "Key-value: DynamoDB, Redis (e.g. user prefs, project settings)",
          "Uses same retrieval as RAG (embed → search)",
          "Agent decides what to store & when to recall",
        ],
      },
    ],
  },

  // --- Part 2: Why Infrastructure Matters ---
  {
    id: "section-infra",
    section: "Why Infrastructure Matters",
    title: "Why Infrastructure Matters",
    subtitle: "Prototype → Production gap",
    layout: "title",
  },
  {
    id: "production-gap",
    section: "Why Infrastructure Matters",
    title: "The Production Gap",
    subtitle: "Prototype vs production",
    layout: "two-column",
    cols: [
      {
        title: "Prototype",
        bullets: ["Local Jupyter / script", "Single user", "No scaling", "Manual tool runs"],
      },
      {
        title: "Production",
        bullets: ["Multi-tenant, concurrent users", "State isolation", "Browser runtime (Chromium)", "Tool orchestration, retries", "Networking (VPC, NAT)", "Reliability, observability"],
      },
    ],
  },
  {
    id: "core-challenges",
    section: "Why Infrastructure Matters",
    title: "Core Production Challenges",
    bullets: [
      "State — session isolation, conversation memory",
      "Tool orchestration — sequencing, retries, timeouts",
      "Browser runtime — Chromium infra, scaling",
      "Networking — VPC, outbound to APIs & target sites",
      "Scaling — concurrency, cold starts",
      "Reliability — logging, tracing, debugging",
    ],
    layout: "default",
  },

  // --- Part 3: AWS Bedrock AgentCore ---
  {
    id: "section-agentcore",
    section: "AWS Bedrock AgentCore",
    title: "AWS Bedrock AgentCore",
    subtitle: "Fargate for AI agents",
    layout: "title",
  },
  {
    id: "fargate-mental-model",
    section: "AWS Bedrock AgentCore",
    title: "Fargate for Agents",
    subtitle: "You bring container, AWS handles the rest",
    bullets: [
      "Package agent as Docker image → push ECR",
      "AWS handles scaling, networking, runtime",
      "Same mental model as ECS Fargate",
    ],
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 160" class="w-full max-w-md mx-auto">
      <rect x="20" y="50" width="100" height="60" rx="8" fill="#f59e0b" fill-opacity="0.2" stroke="#d97706" stroke-width="2"/>
      <text x="70" y="80" text-anchor="middle" fill="#b45309" font-size="12" font-weight="600">Your Container</text>
      <text x="70" y="95" text-anchor="middle" fill="#64748b" font-size="10">(agent + tools)</text>
      <rect x="140" y="20" width="160" height="120" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="220" y="45" text-anchor="middle" fill="#0369a1" font-size="11" font-weight="600">AWS Managed</text>
      <text x="220" y="65" text-anchor="middle" fill="#64748b" font-size="10">Scaling · VPC · Browser · Memory · SSE</text>
      <path d="M120 80 L135 80" stroke="#64748b" stroke-width="2" marker-end="url(#ac-arr)"/>
      <defs><marker id="ac-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker></defs>
    </svg>`,
    layout: "diagram",
  },
  {
    id: "agentcore-features",
    section: "AWS Bedrock AgentCore",
    title: "AgentCore Features",
    bullets: [
      "Container-based — same image runs locally & cloud",
      "VPC networking — private subnets, NAT for outbound",
      "AgentCore Browser — managed Chromium, no Playwright infra",
      "Memory — built-in conversation memory across sessions",
      "Streaming — SSE for real-time progress",
    ],
    layout: "default",
  },
  {
    id: "agentcore-browser",
    section: "AWS Bedrock AgentCore",
    title: "AgentCore Browser",
    subtitle: "Managed Chromium",
    layout: "two-column",
    cols: [
      {
        title: "Before",
        bullets: ["Manage Playwright/Puppeteer", "Docker, scaling, isolation", "Custom infra"],
      },
      {
        title: "After",
        bullets: ["AgentCore Browser", "Managed Chromium", "No browser infra to run"],
      },
    ],
  },
  {
    id: "ai-secure-what",
    section: "AWS Bedrock AgentCore",
    title: "ai-secure.dev",
    subtitle: "What it does",
    bullets: [
      "1. User submits URL + framework (ISO 27001, NIST, SOC2, COBIT)",
      "2. Agent navigates site via AgentCore Browser, live progress",
      "3. Scan completes, summary shown",
      "4. Detailed report: findings + recommendations",
    ],
    layout: "default",
  },
  {
    id: "ai-secure-arch",
    section: "AWS Bedrock AgentCore",
    title: "ai-secure.dev — Architecture",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" class="w-full max-w-lg mx-auto">
      <rect x="20" y="20" width="100" height="50" rx="6" fill="#2563eb" fill-opacity="0.2" stroke="#2563eb" stroke-width="2"/>
      <text x="70" y="50" text-anchor="middle" fill="#1e40af" font-size="11" font-weight="600">Frontend</text>
      <text x="70" y="65" text-anchor="middle" fill="#64748b" font-size="9">Next.js</text>
      <rect x="150" y="50" width="120" height="70" rx="6" fill="#f59e0b" fill-opacity="0.2" stroke="#d97706" stroke-width="2"/>
      <text x="210" y="80" text-anchor="middle" fill="#b45309" font-size="11" font-weight="600">AgentCore Runtime</text>
      <text x="210" y="95" text-anchor="middle" fill="#64748b" font-size="9">your container</text>
      <rect x="150" y="140" width="120" height="50" rx="6" fill="#059669" fill-opacity="0.2" stroke="#059669" stroke-width="2"/>
      <text x="210" y="170" text-anchor="middle" fill="#047857" font-size="10" font-weight="600">Claude</text>
      <rect x="300" y="70" width="80" height="50" rx="6" fill="#0284c7" fill-opacity="0.2" stroke="#0284c7" stroke-width="2"/>
      <text x="340" y="95" text-anchor="middle" fill="#0369a1" font-size="10" font-weight="600">Browser</text>
      <path d="M120 45 L145 75" stroke="#64748b" stroke-width="2" marker-end="url(#arch-arr)"/>
      <path d="M210 120 L210 135" stroke="#64748b" stroke-width="2" marker-end="url(#arch-arr)"/>
      <path d="M270 95 L295 95" stroke="#64748b" stroke-width="2" marker-end="url(#arch-arr)"/>
      <defs><marker id="arch-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#64748b"/></marker></defs>
    </svg>`,
    layout: "diagram",
  },
  {
    id: "ai-secure-tools",
    section: "AWS Bedrock AgentCore",
    title: "ai-secure.dev — Tool Belt",
    bullets: [
      "browser_navigate, browser_snapshot, browser_click, browser_type",
      "http_security_check — headers, TLS, redirects",
      "dns_lookup — SPF/DMARC/CAA",
      "totp — 2FA for authenticated scans",
      "issue_tracker — tracks problems",
    ],
    layout: "default",
  },

  // --- Part 4: Hard Lessons & Economics ---
  {
    id: "section-lessons",
    section: "Hard Lessons & Economics",
    title: "Hard Lessons & Economics",
    layout: "title",
  },
  {
    id: "local-first",
    section: "Hard Lessons & Economics",
    title: "Local-First",
    subtitle: "Same Docker container everywhere",
    bullets: [
      "Develop locally with Docker",
      "Same container runs in AgentCore",
      "Local: playwright-mcp Docker image",
      "Cloud: AgentCore Browser",
      "Parity = faster iteration",
    ],
    layout: "default",
  },
  {
    id: "browser-error-handling",
    section: "Hard Lessons & Economics",
    title: "Browser Error Handling",
    bullets: [
      "Pages don't always load",
      "Elements move, selectors break",
      "Auth flows vary (login, 2FA)",
      "Design tools for retries & fallbacks",
    ],
    layout: "default",
  },
  {
    id: "logging-gotcha",
    section: "Hard Lessons & Economics",
    title: "Logging Gotcha",
    subtitle: "AgentCore logs ≠ app logs",
    bullets: ["AgentCore has its own logs", "Use CloudWatch SDK for app logging", "Otherwise you won't see your logs"],
    code: {
      lang: "typescript",
      text: `import {
  CloudWatchLogsClient,
  PutLogEventsCommand
} from '@aws-sdk/client-cloudwatch-logs';

await logs.send(
  new PutLogEventsCommand({ ... })
);`,
    },
    layout: "two-column",
  },
  {
    id: "iac-cdk",
    section: "Hard Lessons & Economics",
    title: "IaC via CDK",
    subtitle: "Deploy agent like any infra",
    code: {
      lang: "typescript",
      text: `// Package agent as Docker image, push ECR
// Deploy via CDK to AgentCore Runtime
const agentCore = new AgentCoreRuntime(this, 'Agent', {
  image: ecrImage,
  vpc,
});`,
    },
    layout: "default",
  },
  {
    id: "cost-optimization",
    section: "Hard Lessons & Economics",
    title: "Cost Optimization",
    bullets: [
      "Model routing: Haiku (~10× cheaper) for simple, Sonnet for complex",
      "Message caching: ~90% cost reduction on repeated context",
      "Disable extended thinking when not needed (~$0.15/call)",
    ],
    code: {
      lang: "typescript",
      text: `const model = complexity === 'simple'
  ? 'claude-haiku-4-5'
  : 'claude-sonnet-4-5';`,
    },
    layout: "two-column",
  },

  // --- Part 5: Wrap-up ---
  {
    id: "takeaways",
    section: "Wrap-up",
    title: "Key Takeaways",
    bullets: [
      "Agents = LLM + tools + memory + control loop",
      "MCP, sub-agents, skills extend capability",
      "Infrastructure matters — state, browser, scaling",
      "AgentCore = Fargate for agents — container, VPC, browser, memory, SSE",
      "Local-first Docker parity, good error handling, IaC, cost routing",
    ],
    layout: "default",
  },
  {
    id: "resources",
    section: "Wrap-up",
    title: "Resources",
    bullets: [
      "Blog: martinmueller.dev",
      "ai-secure.dev — security compliance scanner",
      "LinkedIn: linkedin.com/in/martinmueller88",
    ],
    layout: "default",
  },
  {
    id: "qa",
    section: "Wrap-up",
    title: "Q&A",
    subtitle: "15 min",
    layout: "title",
  },
];

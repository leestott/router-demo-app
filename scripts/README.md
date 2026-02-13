# Scripts — Playwright MCP Usage

This directory contains three automation scripts that leverage **Playwright** (via the [Playwright MCP server](https://github.com/anthropics/mcp-playwright)) to interact with the running Model Router Demo App. Each script launches a headless Chromium browser, navigates the UI programmatically, and extracts artefacts (screenshots, data, or video) — all without manual intervention.

## Prerequisites

| Requirement | Purpose |
|---|---|
| **Node.js ≥ 18** | Script runtime |
| `npm install` | Installs `playwright` & `@playwright/test` (declared in `devDependencies`) |
| `npx playwright install chromium` | Downloads the Chromium browser binary Playwright needs |
| `npm run dev` | Starts the Vite dev server on `http://localhost:5173` |
| **ffmpeg** (optional) | Only needed by `record-demo.mjs` to convert WebM → MP4 |

## Scripts Overview

### 1. `capture-screenshots.mjs`

Captures a sequence of PNG screenshots that illustrate every key UI state of the app. These images are used in `README.md` and `BLOG_POST.md`.

```bash
node scripts/capture-screenshots.mjs
```

**How Playwright MCP is used:**

- **Browser launch** — `chromium.launch({ headless: true })` opens a headless Chromium instance.
- **Page navigation** — `page.goto()` loads the app; `waitUntil: 'networkidle'` ensures all initial API calls complete.
- **DOM interaction** — `page.click()`, `page.fill()`, and `page.selectOption()` simulate user actions: selecting prompts, clicking buttons ("Run Both", "Run All Prompts", "Clear Results"), switching routing modes (Balanced / Cost / Quality), and entering custom prompts.
- **Wait strategies** — A custom `waitForResults()` helper watches for the "Processing…" spinner to appear and then disappear, ensuring screenshots are taken only after API responses render.
- **Screenshot capture** — `page.screenshot()` and `element.screenshot()` save full-page and element-level PNGs to the `screenshots/` directory.

**Captured states (8 steps):**

1. Initial app state (no prompt selected)
2. Prompt selected (Simple Classification)
3. Single-prompt comparison results (Run Both)
4. Balanced mode — full batch results + distribution chart
5. Cost-Optimised mode — full batch results
6. Quality-Optimised mode — full batch results
7. Custom prompt input and results
8. Custom prompt active state

---

### 2. `extract-results.mjs`

Runs all 10 prompts across three routing modes and extracts structured benchmark data (stats, model distribution, per-request metrics) to stdout as formatted text/JSON.

```bash
node scripts/extract-results.mjs
```

**How Playwright MCP is used:**

- **Browser automation** — Same headless Chromium launch pattern as the screenshot script.
- **UI-driven benchmarking** — Rather than calling APIs directly, this script drives the app's UI to run benchmarks exactly as a user would: selecting a routing mode, clicking "Run All Prompts", and waiting for completion.
- **DOM data extraction** — `page.evaluate()` executes JavaScript inside the browser context to scrape structured data from the rendered DOM:
  - **Stats cards** — Reads `.grid.grid-cols-2 .bg-white` elements for aggregate metrics (avg latency, total cost, savings %).
  - **Results table** — Iterates `<table> <tbody> <tr>` rows, extracting each cell (prompt, path, mode, model, latency, tokens, cost).
  - **Error detection** — Checks for `.bg-red-50` error banners.
- **Model distribution analysis** — Post-processes extracted data to compute which models the router selected and at what frequency.
- **Three-mode sweep** — Sequentially tests Balanced → Cost → Quality modes, clearing results between runs.

**Output format:**

```
=== BALANCED MODE ===
Stats: { "Avg Latency": "1.2s", "Total Cost": "$0.0042", ... }

Results:
Prompt | Path | Mode | Model | Latency | Tokens | Cost
--------------------------------------------------------------------------------
Simple Classification | Router | balanced | gpt-4o-mini | 0.8s | 124 | $0.0001
...

Model Distribution (Router):
  gpt-4o-mini: 6 requests (60%)
  gpt-4o: 4 requests (40%)
```

---

### 3. `record-demo.mjs`

Records a narrated-style MP4 video walkthrough of the entire app, suitable for developer demos and blog posts.

```bash
node scripts/record-demo.mjs
```

**How Playwright MCP is used:**

- **Video recording** — `browser.newContext({ recordVideo: { dir, size } })` enables Playwright's built-in video recording. Every action on the page is captured frame-by-frame as a WebM file.
- **Natural interaction simulation** — A custom `typeNaturally()` function types text character-by-character with configurable delay (22–28 ms per character), creating a realistic "developer typing" effect on camera.
- **Smooth scrolling** — `scrollIntoView()` and `scrollToY()` use `behavior: 'smooth'` to create visually appealing scroll animations that are captured in the video.
- **Paced scene structure** — Strategic `sleep()` calls between actions give viewers time to read and understand each UI state, creating an 8-scene narrative arc:
  1. App overview (UI orientation)
  2. Simple prompt selection
  3. Run Both — single-prompt side-by-side comparison
  4. Run All Prompts — Balanced mode batch results
  5. Cost-Optimised mode
  6. Quality-Optimised mode
  7. Custom developer prompt (code review task typed live)
  8. Final overview
- **Post-processing** — After recording, the script uses `ffmpeg` (via `child_process.execSync`) to convert the WebM to an MP4 with H.264 encoding for broad compatibility.

**Output:** `demo.mp4` in the project root (~3–4 minutes depending on API latency).

---

## Common Playwright Patterns Used

All three scripts share a set of common patterns that demonstrate how Playwright MCP drives browser automation:

| Pattern | Implementation | Purpose |
|---|---|---|
| **Headless browser** | `chromium.launch({ headless: true })` | Run without a visible window (CI/CD friendly) |
| **Viewport control** | `newContext({ viewport: { width: 1440, height: 900 } })` | Consistent, repeatable screen dimensions |
| **Network idle wait** | `waitForLoadState('networkidle')` | Ensure initial data is loaded before interacting |
| **Selector-based actions** | `page.click('text=...')`, `page.locator('button', { hasText: '...' })` | Click buttons by visible text |
| **Form interaction** | `page.fill()`, `page.selectOption()` | Enter text and change dropdowns |
| **DOM evaluation** | `page.evaluate(() => { ... })` | Execute JS in-page to extract data from rendered DOM |
| **Conditional waiting** | `waitForSelector()` with `state: 'hidden'` | Wait for processing spinners to disappear |
| **Screenshot capture** | `page.screenshot({ fullPage: true })` | Full-page and element-level screen captures |
| **Video recording** | `recordVideo: { dir, size }` context option | Capture entire session as video |
| **Error resilience** | try/catch around waits with fallback behaviour | Continue gracefully if timeouts occur |

## Relationship to Playwright MCP

The [Playwright MCP (Model Context Protocol) server](https://github.com/anthropics/mcp-playwright) exposes Playwright's browser automation capabilities as MCP tools that AI agents (such as GitHub Copilot) can invoke. In this project, the Playwright MCP was used during development to:

1. **Iterate on UI automation** — The MCP server allowed an AI assistant to interactively test selectors, refine wait strategies, and debug timing issues by driving a live browser session.
2. **Generate these scripts** — The automation patterns (selector choices, wait logic, extraction queries) were developed and validated through MCP-driven browser sessions, then codified into these standalone `.mjs` scripts.
3. **Validate screenshots and data** — Before finalising the scripts, Playwright MCP tools were used to verify that selectors matched the correct DOM elements and that extracted data was accurate.

The resulting scripts are **standalone** — they import `playwright` directly and do not require the MCP server at runtime. The MCP server served as a development-time tool for building and testing the automation.

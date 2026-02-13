/**
 * Playwright video demo recorder — Model Router Demo App
 *
 * Creates a developer-focused MP4 walkthrough that showcases:
 *  ✦ Intelligent routing — one endpoint, multiple models chosen automatically
 *  ✦ Cost savings across Balanced, Cost, and Quality modes
 *  ✦ Real-time model distribution visualisation
 *  ✦ Custom prompt testing for production validation
 *
 * Narrative flow (≈ 3-4 min depending on API latency):
 *  1. App overview — UI orientation
 *  2. Single prompt comparison (Run Both) — see the router pick a model
 *  3. Batch run (Run All Prompts, Balanced) — aggregate stats + distribution
 *  4. Cost-Optimised mode — compare savings
 *  5. Quality-Optimised mode — accuracy-first routing
 *  6. Custom developer prompt — type & run a real-world coding question
 *
 * Prerequisites:
 *   • Dev server running:  npm run dev  (localhost:5173)
 *   • ffmpeg on PATH (for WebM → MP4 conversion)
 *
 * Usage:  node scripts/record-demo.mjs
 */

import { chromium } from 'playwright';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

/* ──────────────────────── Config ──────────────────────── */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const VIDEO_DIR = path.join(PROJECT_ROOT, 'videos');
const BASE_URL = 'http://localhost:5173';
const VIEWPORT = { width: 1440, height: 900 };

/* ──────────────────────── Helpers ─────────────────────── */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Wait until the "⏳ Processing..." spinner disappears.
 */
async function waitUntilDone(page, timeoutMs = 300_000) {
  // Wait for it to appear (may already be visible)
  try { await page.waitForSelector('text=Processing', { timeout: 6_000 }); } catch { /* ok */ }
  // Now wait for it to go away
  try { await page.waitForSelector('text=Processing', { state: 'hidden', timeout: timeoutMs }); } catch {
    console.warn('  ⚠  Timed out waiting for results — continuing.');
  }
  await sleep(1_200);
}

/** Smooth-scroll an element into view. */
async function scrollIntoView(page, selector) {
  const el = await page.$(selector);
  if (el) { await el.scrollIntoViewIfNeeded(); await sleep(700); }
}

/** Smooth scroll to absolute pixel offset. */
async function scrollToY(page, y) {
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'smooth' }), y);
  await sleep(900);
}

/** Type text character-by-character for a natural "typing" effect. */
async function typeNaturally(page, selector, text, perCharMs = 28) {
  await page.click(selector);
  await sleep(250);
  for (const ch of text) {
    await page.keyboard.type(ch, { delay: perCharMs });
  }
}

/* ──────────────────────── Recording ──────────────────── */

async function record() {
  console.log('🎬  Model Router — Developer Demo Recording\n');

  // Ensure output directory
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: VIDEO_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  try {
    /* ────────────────────────────────────────────────────
     * SCENE 1 — App Overview  (≈ 5 s)
     * Show the full interface: sidebar (mode selector,
     * prompt list), run controls, empty results area.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 1/8 — App overview');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await sleep(4_000);   // Let the viewer read the title & layout

    /* ────────────────────────────────────────────────────
     * SCENE 2 — Select a Simple Prompt  (≈ 3 s)
     * Highlight that the app ships with 10 prompt
     * categories from simple ➜ complex.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 2/8 — Select a simple prompt');
    const simpleBtn = page.locator('button', { hasText: '1. Simple Classification' });
    await simpleBtn.scrollIntoViewIfNeeded();
    await sleep(600);
    await simpleBtn.click();
    await sleep(2_500);

    /* ────────────────────────────────────────────────────
     * SCENE 3 — Run Both: Side-by-Side Comparison (≈ 12 s)
     * KEY MESSAGE: one API call, router picks the model.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 3/8 — Run Both (single prompt comparison)');
    await page.locator('button', { hasText: 'Run Both' }).click();
    await waitUntilDone(page);
    await sleep(1_500);

    // Pause on the results table so developers can see model, latency, tokens, cost
    await scrollIntoView(page, 'table');
    await sleep(3_000);

    /* ────────────────────────────────────────────────────
     * SCENE 4 — Batch Run: Balanced Mode  (≈ 40-60 s)
     * KEY MESSAGE: 10 diverse prompts → router uses 4+
     * models automatically; cost savings shown in stats.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 4/8 — Run All Prompts (Balanced mode)');
    await page.locator('button', { hasText: 'Clear Results' }).click();
    await sleep(800);
    await scrollToY(page, 0);
    await sleep(600);

    await page.locator('button', { hasText: 'Run All Prompts' }).click();
    await waitUntilDone(page);
    await sleep(1_000);

    // Show the stats cards (avg latency, cost, savings %)
    await scrollIntoView(page, '.grid.grid-cols-2.lg\\:grid-cols-4');
    await sleep(3_000);

    // Show the distribution chart — the star visual
    await scrollIntoView(page, '.recharts-wrapper');
    await sleep(3_500);

    // Scroll through the full results table
    await scrollIntoView(page, 'table');
    await sleep(2_000);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await sleep(2_500);
    await scrollToY(page, 0);
    await sleep(1_000);

    /* ────────────────────────────────────────────────────
     * SCENE 5 — Cost-Optimised Mode  (≈ 40-60 s)
     * KEY MESSAGE: Switch mode in the portal (here via
     * dropdown) — no code change needed. Routes more
     * aggressively to smaller, cheaper models.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 5/8 — Cost-Optimised mode');
    await page.locator('button', { hasText: 'Clear Results' }).click();
    await sleep(600);

    // Switch mode dropdown — visible, developer-friendly
    await page.selectOption('#routing-mode', 'cost');
    await sleep(2_000);

    await page.locator('button', { hasText: 'Run All Prompts' }).click();
    await waitUntilDone(page);
    await sleep(1_200);

    // Show savings & distribution
    await scrollIntoView(page, '.grid.grid-cols-2.lg\\:grid-cols-4');
    await sleep(3_000);
    await scrollIntoView(page, '.recharts-wrapper');
    await sleep(3_000);
    await scrollToY(page, 0);
    await sleep(800);

    /* ────────────────────────────────────────────────────
     * SCENE 6 — Quality-Optimised Mode  (≈ 40-60 s)
     * KEY MESSAGE: Highest savings observed here because
     * the router only upgrades to premium models when
     * complexity warrants it.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 6/8 — Quality-Optimised mode');
    await page.locator('button', { hasText: 'Clear Results' }).click();
    await sleep(600);

    await page.selectOption('#routing-mode', 'quality');
    await sleep(2_000);

    await page.locator('button', { hasText: 'Run All Prompts' }).click();
    await waitUntilDone(page);
    await sleep(1_200);

    // Show savings & distribution
    await scrollIntoView(page, '.grid.grid-cols-2.lg\\:grid-cols-4');
    await sleep(3_000);
    await scrollIntoView(page, '.recharts-wrapper');
    await sleep(3_000);
    await scrollToY(page, 0);
    await sleep(800);

    /* ────────────────────────────────────────────────────
     * SCENE 7 — Custom Developer Prompt  (≈ 20 s)
     * KEY MESSAGE: Developers can paste their own prompts
     * to validate routing behaviour before production.
     * Uses a realistic coding question.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 7/8 — Custom developer prompt');
    await page.locator('button', { hasText: 'Clear Results' }).click();
    await sleep(600);

    // Switch back to Balanced (general purpose)
    await page.selectOption('#routing-mode', 'balanced');
    await sleep(1_000);

    // Open the custom prompt panel
    await page.locator('button', { hasText: 'Custom' }).click();
    await sleep(1_500);

    // A developer-relevant prompt — code review task
    const devPrompt =
      'Review this TypeScript function for bugs, performance issues, and security concerns. ' +
      'Suggest improvements with code examples:\n\n' +
      'async function fetchUserData(id: string) {\n' +
      '  const res = await fetch(`/api/users/${id}`);\n' +
      '  const data = res.json();\n' +
      '  localStorage.setItem("user", JSON.stringify(data));\n' +
      '  return data;\n' +
      '}';

    await typeNaturally(page, 'textarea[aria-label="Custom prompt text"]', devPrompt, 22);
    await sleep(2_500);

    // Submit — triggers automatic comparison
    await page.locator('button', { hasText: 'Use This Prompt' }).click();
    await waitUntilDone(page);
    await sleep(2_000);

    // Show the results
    await scrollIntoView(page, 'table');
    await sleep(3_500);

    /* ────────────────────────────────────────────────────
     * SCENE 8 — Final Overview  (≈ 4 s)
     * Scroll back to the top for a clean ending.
     * ──────────────────────────────────────────────────── */
    console.log('Scene 8/8 — Final overview');
    await scrollToY(page, 0);
    await sleep(4_000);

    console.log('\n✅  All scenes recorded. Flushing video…');

  } catch (err) {
    console.error('\n❌  Error during recording:', err.message);
    process.exitCode = 1;
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }

  /* ──────────────────── WebM → MP4 ──────────────────── */

  const webmFiles = fs.readdirSync(VIDEO_DIR)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => path.join(VIDEO_DIR, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (webmFiles.length === 0) {
    console.error('❌  No WebM video file found in', VIDEO_DIR);
    process.exit(1);
  }

  const webmPath = webmFiles[0];
  const mp4Path = path.join(PROJECT_ROOT, 'demo.mp4');

  console.log(`\n🔄  Converting WebM → MP4…`);
  console.log(`    Source : ${webmPath}`);
  console.log(`    Output : ${mp4Path}`);

  try {
    execSync(
      `ffmpeg -y -i "${webmPath}" ` +
      `-c:v libx264 -preset medium -crf 22 ` +
      `-pix_fmt yuv420p -movflags +faststart ` +
      `"${mp4Path}"`,
      { stdio: 'inherit' },
    );
    // Tidy up intermediate file
    fs.unlinkSync(webmPath);
    console.log(`\n🎬  Demo video saved → ${mp4Path}`);
    console.log(`    Size: ${(fs.statSync(mp4Path).size / 1024 / 1024).toFixed(1)} MB`);
  } catch (err) {
    console.error('❌  ffmpeg conversion failed:', err.message);
    console.log(`    WebM retained at: ${webmPath}`);
    process.exitCode = 1;
  }
}

record();

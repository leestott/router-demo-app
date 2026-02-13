/**
 * Playwright screenshot capture script for Model Router Demo App.
 *
 * Captures the key UI states used in README.md and BLOG_POST.md.
 * Requires: npm run dev (server on http://localhost:5173)
 * Usage:    node scripts/capture-screenshots.mjs
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots');
const BASE_URL = 'http://localhost:5173';

// Viewport for consistent screenshots
const VIEWPORT = { width: 1440, height: 900 };

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForNetworkIdle(page, timeoutMs = 5000) {
  try {
    await page.waitForLoadState('networkidle', { timeout: timeoutMs });
  } catch {
    // Continue even if network doesn't fully idle
  }
}

async function screenshot(page, name, fullPage = false) {
  const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage });
  console.log(`  ✓ ${name}.png`);
}

/**
 * Wait for the "Processing..." indicator to disappear, meaning the API calls
 * have finished and results are rendered.
 */
async function waitForResults(page, timeoutMs = 180000) {
  // Wait for processing indicator to appear
  try {
    await page.waitForSelector('text=Processing', { timeout: 5000 });
  } catch {
    // It may have already appeared and gone
  }
  // Wait for it to disappear (API calls complete)
  try {
    await page.waitForSelector('text=Processing', { state: 'hidden', timeout: timeoutMs });
  } catch {
    console.warn('  ⚠ Timed out waiting for results, capturing anyway');
  }
  // Give UI a moment to render results
  await sleep(1000);
}

async function main() {
  console.log('🚀 Starting screenshot capture...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  try {
    // ─── 1. Initial load — app with no prompt selected ───
    console.log('1/8  Initial app state');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await sleep(500);
    await screenshot(page, 'app-initial-state');

    // ─── 2. Select a prompt (Simple Classification) ───
    console.log('2/8  Prompt selected');
    await page.click('text=1. Simple Classification');
    await sleep(500);
    await screenshot(page, 'app-prompt-selected');

    // ─── 3. Run Both (single prompt comparison) ───
    console.log('3/8  Run Both — single prompt');
    await page.click('text=⚡ Run Both (Compare)');
    await waitForResults(page);
    await screenshot(page, 'app-results-single');

    // ─── 4. Clear and Run All Prompts (Balanced mode) ───
    console.log('4/8  Run All Prompts — Balanced mode');
    await page.click('text=🗑️ Clear Results');
    await sleep(300);
    await page.click('text=🚀 Run All Prompts');
    await waitForResults(page, 300000);
    await screenshot(page, 'balanced-mode-full-results', true);

    // Also capture just the distribution chart area
    const chartEl = await page.$('.recharts-responsive-container');
    if (chartEl) {
      await chartEl.screenshot({ path: path.join(SCREENSHOT_DIR, 'app-full-distribution.png') });
      console.log('  ✓ app-full-distribution.png (chart only)');
    }

    // Capture the complete results (scrollable area)
    await screenshot(page, 'app-complete-results', true);

    // ─── 5. Switch to Cost-Optimised and Run All ───
    console.log('5/8  Run All Prompts — Cost mode');
    await page.click('text=🗑️ Clear Results');
    await sleep(300);
    await page.selectOption('#routing-mode', 'cost');
    await sleep(300);
    await page.click('text=🚀 Run All Prompts');
    await waitForResults(page, 300000);
    await screenshot(page, 'cost-mode-full-results', true);

    // ─── 6. Switch to Quality-Optimised and Run All ───
    console.log('6/8  Run All Prompts — Quality mode');
    await page.click('text=🗑️ Clear Results');
    await sleep(300);
    await page.selectOption('#routing-mode', 'quality');
    await sleep(300);
    await screenshot(page, 'quality-mode-selected');
    await page.click('text=🚀 Run All Prompts');
    await waitForResults(page, 300000);
    await screenshot(page, 'quality-mode-full-results', true);

    // ─── 7. Custom Prompt — enter a prompt ───
    console.log('7/8  Custom prompt flow');
    await page.click('text=🗑️ Clear Results');
    await sleep(300);
    // Switch mode back to balanced
    await page.selectOption('#routing-mode', 'balanced');
    await sleep(300);

    // Click the Custom button
    await page.click('text=✏️ Custom');
    await sleep(500);
    await screenshot(page, 'custom-prompt-input');

    // Type a custom prompt
    const customText = 'Explain quantum entanglement in simple terms that a high school student would understand. Include one real-world analogy.';
    await page.fill('textarea[aria-label="Custom prompt text"]', customText);
    await sleep(300);
    await screenshot(page, 'custom-prompt-entered');

    // Submit the custom prompt (auto-runs both)
    await page.click('text=✓ Use This Prompt');
    await waitForResults(page);
    await screenshot(page, 'custom-prompt-results');

    // ─── 8. Custom prompt — active state showing in sidebar ───
    console.log('8/8  Custom prompt active badge');
    await screenshot(page, 'custom-prompt-active');

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`   Output: ${SCREENSHOT_DIR}`);

  } catch (err) {
    console.error('\n❌ Error during screenshot capture:', err.message);
    // Take an error screenshot for debugging
    try {
      await screenshot(page, '_error-state');
    } catch { /* ignore */ }
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main();

/**
 * Extract benchmark results from the running app via Playwright.
 * Captures the results table + stats cards as structured data.
 */

import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:5173';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForResults(page, timeoutMs = 180000) {
  try { await page.waitForSelector('text=Processing', { timeout: 5000 }); } catch {}
  try { await page.waitForSelector('text=Processing', { state: 'hidden', timeout: timeoutMs }); } catch {}
  await sleep(1000);
}

async function extractResults(page) {
  return await page.evaluate(() => {
    // Extract stats cards
    const statsCards = document.querySelectorAll('.grid.grid-cols-2 .bg-white');
    const stats = {};
    statsCards.forEach(card => {
      const label = card.querySelector('.text-xs')?.textContent?.trim() || '';
      const value = card.querySelector('.text-2xl')?.textContent?.trim() || '';
      stats[label] = value;
    });

    // Extract results table
    const rows = document.querySelectorAll('table tbody tr');
    const results = [];
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 7) {
        results.push({
          prompt: cells[0].textContent?.trim() || '',
          path: cells[1].textContent?.trim() || '',
          mode: cells[2].textContent?.trim() || '',
          model: cells[3].textContent?.trim() || '',
          latency: cells[4].textContent?.trim() || '',
          tokens: cells[5].textContent?.trim() || '',
          cost: cells[6].textContent?.trim() || '',
        });
      }
    });

    // Check for errors
    const errorEl = document.querySelector('.bg-red-50');
    const error = errorEl ? errorEl.textContent?.trim() : null;

    return { stats, results, error };
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // ── Balanced mode ──
    console.log('=== BALANCED MODE ===');
    await page.selectOption('#routing-mode', 'balanced');
    await sleep(300);
    await page.click('text=🚀 Run All Prompts');
    await waitForResults(page, 300000);
    const balanced = await extractResults(page);
    console.log('Stats:', JSON.stringify(balanced.stats, null, 2));
    if (balanced.error) console.log('Error:', balanced.error);
    console.log('\nResults:');
    console.log('Prompt | Path | Mode | Model | Latency | Tokens | Cost');
    console.log('-'.repeat(80));
    balanced.results.forEach(r => {
      console.log(`${r.prompt} | ${r.path} | ${r.mode} | ${r.model} | ${r.latency} | ${r.tokens} | ${r.cost}`);
    });

    // Count model distribution
    const routerResults = balanced.results.filter(r => r.path === 'Router');
    const modelCounts = {};
    routerResults.forEach(r => {
      modelCounts[r.model] = (modelCounts[r.model] || 0) + 1;
    });
    console.log('\nModel Distribution (Router):');
    Object.entries(modelCounts).sort((a, b) => b[1] - a[1]).forEach(([model, count]) => {
      console.log(`  ${model}: ${count} requests (${(count / routerResults.length * 100).toFixed(0)}%)`);
    });

    // ── Cost mode ──
    console.log('\n=== COST MODE ===');
    await page.click('text=🗑️ Clear Results');
    await sleep(300);
    await page.selectOption('#routing-mode', 'cost');
    await sleep(300);
    await page.click('text=🚀 Run All Prompts');
    await waitForResults(page, 300000);
    const cost = await extractResults(page);
    console.log('Stats:', JSON.stringify(cost.stats, null, 2));
    if (cost.error) console.log('Error:', cost.error);

    // ── Quality mode ──
    console.log('\n=== QUALITY MODE ===');
    await page.click('text=🗑️ Clear Results');
    await sleep(300);
    await page.selectOption('#routing-mode', 'quality');
    await sleep(300);
    await page.click('text=🚀 Run All Prompts');
    await waitForResults(page, 300000);
    const quality = await extractResults(page);
    console.log('Stats:', JSON.stringify(quality.stats, null, 2));
    if (quality.error) console.log('Error:', quality.error);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

main();

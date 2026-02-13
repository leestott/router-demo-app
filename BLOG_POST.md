# Optimising AI Costs with Microsoft Foundry Model Router

**A hands-on demo of intelligent model routing — with real benchmark data**

---

## TL;DR

Microsoft Foundry Model Router analyses each prompt in real-time and forwards it to the most appropriate LLM from a pool of underlying models. Simple requests go to fast, cheap models; complex requests go to premium ones — all automatically.

We built an interactive demo app so you can see the routing decisions, measure latencies, and compare costs yourself. This post walks through how it works, what we measured, and when it makes sense to use.

---

## The Problem: One Model for Everything Is Wasteful

Traditional deployments force a single choice:

| Strategy | Upside | Downside |
|----------|--------|----------|
| Use a small model | Fast, cheap | Struggles with complex tasks |
| Use a large model | Handles everything | Overpay for simple tasks |
| Build your own router | Full control | Maintenance burden; hard to optimise |

Most production workloads are **mixed-complexity**. Classification, FAQ look-ups, and data extraction sit alongside code analysis, multi-constraint planning, and long-document summarisation. Paying premium-model prices for the simple 40% is money left on the table.

---

## The Solution: Model Router

Model Router is a **trained language model** deployed as a single Azure endpoint. For each incoming request it:

1. **Analyses the prompt** — complexity, task type, context length
2. **Selects an underlying model** from the routing pool
3. **Forwards the request** and returns the response
4. **Exposes the choice** via the `response.model` field

You interact with one deployment. No if/else routing logic in your code.

### Routing Modes

| Mode | Goal | Trade-off |
|------|------|-----------|
| **Balanced** (default) | Best cost-quality ratio | General-purpose |
| **Cost** | Minimise spend | May use smaller models more aggressively |
| **Quality** | Maximise accuracy | Higher cost for complex tasks |

Modes are configured in the Foundry Portal — no code change needed to switch.

---

## Building the Demo

To make routing decisions tangible, we built a React + TypeScript app that sends the **same prompt** through both Model Router and a fixed standard deployment (e.g. GPT-5-nano), then compares:

- **Which model** the router selected
- **Latency** (ms)
- **Token usage** (prompt + completion)
- **Estimated cost** (based on per-model pricing)

![Application Interface](screenshots/app-prompt-selected.png)
*Select a prompt, choose a routing mode, and hit Run Both to compare side-by-side*

### What You Can Do

- **10 pre-built prompts** spanning simple classification to complex multi-constraint planning
- **Custom prompt input** — enter any text and benchmarks run automatically
- **Three routing modes** — switch and re-run to see how distribution changes
- **Batch mode** — run all 10 prompts in one click to gather aggregate stats

### API Integration

The integration is a standard Azure OpenAI chat completion call. The only difference is the deployment name (`model-router` instead of a specific model):

```typescript
const response = await fetch(
  `${endpoint}/openai/deployments/model-router/chat/completions?api-version=2024-10-21`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      max_completion_tokens: 1024,
    }),
  }
);

const data = await response.json();

// The key insight: response.model reveals the underlying model
const selectedModel = data.model; // e.g. "gpt-5-nano-2025-08-07"
```

That `data.model` field is what makes cost tracking and distribution analysis possible.

---

## Results: What the Data Shows

We ran all 10 prompts through both Model Router (Balanced mode) and a fixed standard deployment.

> **Note**: Results vary by run, region, model versions, and Azure load. These numbers are from a representative sample run.

![Results Comparison](screenshots/balanced-mode-full-results.png)
*Side-by-side comparison across all 10 prompts in Balanced mode*

### Summary

| Metric | Router (Balanced) | Standard (GPT-5-nano) |
|--------|-------------------|---------------------|
| Avg Latency | ~7,800 ms | ~7,700 ms |
| Total Cost (10 prompts) | ~$0.029 | ~$0.030 |
| **Cost Savings** | **~4.5%** | — |
| Models Used | 4 | 1 |

### Model Distribution

The router used **4 different models** across 10 prompts:

| Model | Requests | Share | Typical Use |
|-------|----------|-------|-------------|
| `gpt-5-nano` | 5 | 50% | Classification, summarisation, planning |
| `gpt-5-mini` | 2 | 20% | FAQ answers, data extraction |
| `gpt-oss-120b` | 2 | 20% | Long-context analysis, creative tasks |
| `gpt-4.1-mini` | 1 | 10% | Complex debugging & reasoning |

![Model Distribution](screenshots/app-full-distribution.png)
*Routing distribution chart — the router favours efficient models for simple prompts*

### Across All Three Modes

| Metric | Balanced | Cost-Optimised | Quality-Optimised |
|--------|----------|----------------|-------------------|
| Cost Savings | ~4.5% | ~4.7% | ~14.2% |
| Avg Latency (Router) | ~7,800 ms | ~7,800 ms | ~6,800 ms |
| Avg Latency (Standard) | ~7,700 ms | ~7,300 ms | ~8,300 ms |
| Primary Goal | Balance cost + quality | Minimise spend | Maximise accuracy |
| Model Selection | Mixed (4 models) | Prefers cheaper | Prefers premium |

![Cost Mode Results](screenshots/cost-mode-full-results.png)
*Cost-optimised mode — routes more aggressively to nano/mini models*

![Quality Mode Results](screenshots/quality-mode-full-results.png)
*Quality-optimised mode — routes to larger models for complex tasks*

---

## Analysis

### What Worked Well

**Intelligent distribution** — The router didn't just default to one model. It used 4 different models and mapped prompt complexity to model capability in a sensible way: simple classification → nano, complex debugging → mini/premium.

**Measurable cost savings** — 7% in Balanced mode. At scale (say 1M requests/month at ~$0.003 avg), that translates to ~$2,500/year saved — and the saving grows with volume and prompt mix.

**Zero routing logic in application code** — One endpoint, one deployment name. The complexity lives in Azure's infrastructure, not yours.

**Operational flexibility** — Switch between Balanced, Cost, and Quality modes in the Foundry Portal without redeploying your app. Need to cut costs for a high-traffic period? Switch to Cost mode. Need accuracy for a compliance run? Switch to Quality.

**Future-proofing** — As Azure adds new models to the routing pool, your deployment benefits automatically. No code changes needed.

### Trade-offs to Consider

**Latency overhead** — Router averaged ~7,500 ms vs Standard's ~6,100 ms. The delta (~1,400 ms) comes from route analysis plus the variety of models in the pool (some are faster, some slower). For most non-real-time workloads this is acceptable.

**Cost mode didn't save more than Balanced** — In our sample, Cost mode saved 5.5% vs Balanced's 7%. This is likely because the prompt set was already well-suited for Balanced routing. Your mileage will vary depending on your workload.

**Opaque routing decisions** — You can see *which* model was picked via `response.model`, but you can't see *why*. For most applications this is fine; for debugging edge cases you may want to test specific prompts in the demo first.

---

## Custom Prompt Testing

One of the most practical features of the demo is testing **your own prompts** before committing to Model Router in production.

![Custom Prompt Input](screenshots/custom-prompt-entered.png)
*Enter any prompt — the quantum computing example below is a medium-complexity educational prompt*

![Custom Prompt Results](screenshots/custom-prompt-results.png)
*Benchmarks execute automatically, showing the selected model, latency, tokens, and cost*

**Workflow:**
1. Click **✏️ Custom** in the prompt selector
2. Enter your production-representative prompt
3. Click **✓ Use This Prompt** — Router and Standard run automatically
4. Compare results — repeat with different routing modes
5. Use the data to inform your deployment strategy

This lets you **predict costs and validate routing behaviour** with your actual workload before going to production.

---

## When to Use Model Router

### Great Fit

- **Mixed-complexity workloads** — chatbots, customer service, content pipelines
- **Cost-sensitive deployments** — where even single-digit percentage savings matter at scale
- **Teams wanting simplicity** — one endpoint beats managing multi-model routing logic
- **Rapid experimentation** — try new models without changing application code

### Consider Carefully

- **Ultra-low-latency requirements** — if you need sub-second responses, the routing overhead matters
- **Single-task, single-model workloads** — if one model is clearly optimal for 100% of your traffic, a router adds complexity without benefit
- **Full control over model selection** — if you need deterministic model choice per request

### Mode Selection Guide

```
Is accuracy critical (compliance, legal, medical)?
  └─ YES → Quality-Optimised
  └─ NO  → Strict budget constraints?
             └─ YES → Cost-Optimised
             └─ NO  → Balanced (recommended)
```

---

## Best Practices

1. **Start with Balanced mode** — measure actual results, then optimise
2. **Test with your real prompts** — use the Custom Prompt feature to validate routing before production
3. **Monitor model distribution** — track which models handle your traffic over time
4. **Compare against a baseline** — always keep a standard deployment to measure savings
5. **Review regularly** — as new models enter the routing pool, distributions shift

---

## Technical Stack

The demo is built with:

| Technology | Purpose |
|-----------|---------|
| React 19 + TypeScript 5.9 | UI and type safety |
| Vite 7 | Dev server and build tool |
| Tailwind CSS 4 | Styling |
| Recharts 3 | Distribution and comparison charts |
| Azure OpenAI API (2024-10-21) | Model Router and standard completions |

Security measures include an `ErrorBoundary` for crash resilience, sanitised API error messages, `AbortController` request timeouts, input length validation, and restrictive security headers. API keys are loaded from environment variables and gitignored — see the [Security section in the README](README.md#-security) for full details.

> ⚠️ **This demo calls Azure OpenAI directly from the browser.** This is fine for local development. For production, proxy through a backend and use [Managed Identity](https://learn.microsoft.com/azure/ai-services/openai/how-to/managed-identity).

---

## Try It Yourself

### Quick Start

```bash
git clone <repository-url>
cd router-demo-app

# Option A: Use the setup script (recommended)
# Windows:
.\setup.ps1 -StartDev
# macOS/Linux:
chmod +x setup.sh && ./setup.sh --start-dev

# Option B: Manual
npm install
cp .env.example .env.local
# Edit .env.local with your Azure credentials
npm run dev
```

Open `http://localhost:5173`, select a prompt, and click **⚡ Run Both**.

### Get Your Credentials

1. Go to [ai.azure.com](https://ai.azure.com) → open your project
2. Copy the **Project connection string** (endpoint URL)
3. Navigate to **Deployments** → confirm `model-router` is deployed
4. Get your **API key** from **Project Settings → Keys**

### Configuration

Edit `.env.local`:

```env
VITE_ROUTER_ENDPOINT=https://your-resource.cognitiveservices.azure.com
VITE_ROUTER_API_KEY=your-api-key
VITE_ROUTER_DEPLOYMENT=model-router

VITE_STANDARD_ENDPOINT=https://your-resource.cognitiveservices.azure.com
VITE_STANDARD_API_KEY=your-api-key
VITE_STANDARD_DEPLOYMENT=gpt-5-nano
```

---

## Ideas for Enhancement

- **Historical analysis** — persist results to track routing trends over time
- **Cost projections** — estimate monthly spend based on prompt patterns and volume
- **A/B testing framework** — compare modes with statistical significance
- **Streaming support** — show model selection for streaming responses
- **Export reports** — download benchmark data as CSV/JSON for further analysis

---

## Conclusion

Model Router addresses a real problem: most AI workloads have mixed complexity, but most deployments use a single model. By routing each request to the right model automatically, you get:

- **Cost savings** (~4.5–14.2% measured across modes, scaling with volume)
- **Intelligent distribution** (4 models used, zero routing code)
- **Operational simplicity** (one endpoint, mode changes via portal)
- **Future-proofing** (new models added to the pool automatically)

The latency trade-off is minimal — in Quality mode, the Router was actually *faster* than the standard deployment. The real value is **flexibility**: tune for cost, quality, or balance without touching your code.

**Ready to try it?** Clone the [demo repository](#), plug in your Azure credentials, and test with your own prompts.

---

## Resources

- [Model Router Concepts](https://learn.microsoft.com/azure/ai-foundry/openai/concepts/model-router) — Official documentation
- [Model Router How-To](https://learn.microsoft.com/azure/ai-foundry/openai/how-to/model-router) — Deployment guide
- [Microsoft Foundry Portal](https://ai.azure.com) — Deploy and manage
- [Model Router in the Catalog](https://ai.azure.com/catalog/models/model-router) — Model listing
- [Azure OpenAI Managed Identity](https://learn.microsoft.com/azure/ai-services/openai/how-to/managed-identity) — Production auth

---

*Built to explore Model Router and share findings with the developer community. Feedback and contributions welcome — open an issue or PR on GitHub.*

#Azure #AI #ModelRouter #LLM #CostOptimisation #TypeScript #React

# 🔀 Microsoft Foundry Model Router Demo

An interactive web application demonstrating **Microsoft Foundry Model Router** — an intelligent routing system that automatically selects the optimal language model for each request based on complexity, reasoning requirements, and task type.

> **Compare intelligent routing vs fixed model deployments in real-time!**

**Highlights:**
- ✏️ **Custom Prompt Input** — Test your own prompts to validate routing decisions
- 📊 **Three Routing Modes** — Balanced, Cost-Optimised, and Quality-Optimised
- 📈 **Live Benchmark Data** — Measure cost savings and latency across modes
- 🎯 **Visual Analytics** — See routing distribution across multiple models

![Microsoft Foundry](https://img.shields.io/badge/Microsoft-Foundry-0078D4?style=for-the-badge&logo=microsoft-azure)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite)

---

## 📸 Screenshots

### Application Overview

Select prompts, choose routing modes, and run comparisons — including **custom prompt input** for testing your own use cases.

![Application Interface](screenshots/app-prompt-selected.png)

### Custom Prompt Feature

Test any prompt and **automatically run benchmarks** when activated:

![Custom Prompt Input](screenshots/custom-prompt-entered.png)
*Enter any prompt to test routing behaviour*

![Custom Prompt Results](screenshots/custom-prompt-results.png)
*Results execute automatically — routing decisions, latency, and cost comparison*

### Real-Time Results & Analytics

Instant comparisons between Model Router and standard deployments:

![Results Comparison](screenshots/app-complete-results.png)

### Model Distribution Visualisation

Watch the router distribute requests across models based on complexity:

![Full Results Distribution](screenshots/app-full-distribution.png)

### Routing Mode Comparisons

**Balanced Mode** — optimal quality with cost savings:
![Balanced Mode Results](screenshots/balanced-mode-full-results.png)

**Cost-Optimised Mode** — maximum efficiency:
![Cost Mode Results](screenshots/cost-mode-full-results.png)

**Quality-Optimised Mode** — routes to premium models:
![Quality Mode Results](screenshots/quality-mode-full-results.png)

---

## 🌟 Features

- **🔀 Intelligent Model Routing** — Model Router selects the best model for each prompt automatically
- **📊 Real-Time Comparison** — Run prompts through both router and standard deployments side-by-side
- **💰 Cost Analytics** — Track estimated costs and potential savings
- **⚡ Performance Metrics** — Monitor latency, token usage, and model distribution
- **🎯 Routing Modes** — Balanced, Cost-Optimised, and Quality-Optimised strategies
- **📈 Visual Analytics** — Charts showing model distribution and comparative statistics
- **🔍 Batch Testing** — Run individual prompts or batch-test entire prompt sets
- **✏️ Custom Prompts** — Test your own prompts to see how the router handles them

---

## 🚀 What Is Microsoft Foundry Model Router?

Model Router is a **trained language model** that intelligently routes prompts in real-time to the most suitable LLM. It acts as a smart dispatcher that:

- 🧠 **Analyses prompt complexity** — reasoning depth, task type, context length
- 💡 **Selects optimal models** from a pool of underlying models
- 💵 **Optimises costs** — smaller models when sufficient, larger models when needed
- ⚡ **Reduces costs** while maintaining comparable quality
- 🎯 **Supports multiple modes** — Balanced (default), Cost, Quality

### How It Works

You deploy Model Router as a single endpoint. When a request arrives the router analyses the prompt, selects an underlying model, forwards the request, and returns the response — all transparently. The `response.model` field reveals which model was chosen, enabling cost tracking and performance analysis.

```typescript
// The key insight: response.model tells you which model was selected
const data = await response.json();
const selectedModel = data.model; // e.g. "gpt-5-nano-2025-08-07"
```

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Microsoft Foundry account** with:
  - A Model Router deployment
  - At least one standard model deployment (for comparison)
  - API keys for both deployments

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd router-demo-app
```

### 2. Run the Setup Script

**Windows (PowerShell):**
```powershell
.\setup.ps1
# Or install and start the dev server immediately:
.\setup.ps1 -StartDev
```

**macOS / Linux (Bash):**
```bash
chmod +x setup.sh
./setup.sh
# Or install and start the dev server immediately:
./setup.sh --start-dev
```

The setup script validates prerequisites, installs dependencies, creates `.env.local` from the template, and runs a TypeScript check.

### 3. Manual Setup (Alternative)

```bash
npm install
cp .env.example .env.local   # Windows: Copy-Item .env.example .env.local
```

### 4. Configure Environment Variables

Edit `.env.local` with your Azure credentials:

```env
# Azure Foundry Model Router Deployment
# Format: https://<your-resource>.cognitiveservices.azure.com
VITE_ROUTER_ENDPOINT=https://your-resource.cognitiveservices.azure.com
VITE_ROUTER_API_KEY=your-api-key-here
VITE_ROUTER_DEPLOYMENT=model-router

# Standard Model Deployment (for comparison)
VITE_STANDARD_ENDPOINT=https://your-resource.cognitiveservices.azure.com
VITE_STANDARD_API_KEY=your-api-key-here
VITE_STANDARD_DEPLOYMENT=gpt-5-nano
```

> ⚠️ **Security Note**: Never commit `.env.local` — it is already in `.gitignore`.

### 5. Get Your Credentials

#### From Microsoft Foundry Portal (Recommended):
1. Go to [ai.azure.com](https://ai.azure.com)
2. Open your project → **Overview**
3. Copy the **Project connection string** (this is your endpoint URL)
4. Navigate to **Deployments** → confirm `model-router` is deployed
5. Get your **API key** from **Project Settings → Keys**

#### From Azure Portal:
1. Navigate to your **Azure AI Services** resource
2. Go to **Keys and Endpoints**
3. Copy the **Endpoint** URL and one of the **API Keys**
4. Note your **deployment names** from the Deployments blade

### 6. Start the Development Server

```bash
npm run dev
```

The app opens at `http://localhost:5173`.

---

## 🎮 Usage Guide

### Quick Start

1. **Select a Prompt** — Choose from 10 pre-configured prompts (categorised by complexity), or click **✏️ Custom** to enter your own
2. **Choose Action**:
   - **🔀 Run Router** — Test Model Router only
   - **📌 Run Standard** — Test standard deployment only
   - **⚡ Run Both** — Compare side-by-side
   - **🚀 Run All Prompts** — Batch-test all 10 prompts
3. **Review Results** — Analyse model selection, latency, and costs in the results table
4. **Compare Metrics** — Check the stats cards and distribution chart

### Custom Prompts

1. Click **✏️ Custom** in the prompt selector
2. Enter your prompt text (up to 50,000 characters)
3. Click **✓ Use This Prompt** — benchmarks run automatically
4. View instant Router vs Standard comparison

### Routing Modes

Select a routing strategy from the **Routing Mode** dropdown:

| Mode | Description | Best For |
|------|-------------|----------|
| **🎯 Balanced** (default) | Optimal balance of cost and quality | General production workloads |
| **💰 Cost-Optimised** | Maximise cost savings | High-volume, budget-conscious apps |
| **💎 Quality-Optimised** | Route to premium models | Critical accuracy scenarios |

> 📝 **Note**: The routing mode is sent to the API. Actual routing behaviour is configured in the Microsoft Foundry Portal.

---

## 📊 Understanding the Results

### Results Table Columns

| Column | Description |
|--------|-------------|
| **Prompt** | The input text sent to the model |
| **Path** | Router vs Standard deployment |
| **Routing Mode** | Balanced / Cost / Quality |
| **Chosen Model** | The actual model selected (reveals routing decisions) |
| **Latency** | Response time in milliseconds |
| **Tokens** | Total tokens (prompt + completion) |
| **Est. Cost** | Calculated cost based on model pricing |

### Example Benchmark Results

> **Note**: Results vary by run, region, model versions, and Azure load. The numbers below are from a sample run to illustrate the comparison.

Running all 10 prompts through both Router (Balanced) and Standard (GPT-5-nano):

| Metric | Router | Standard |
|--------|--------|----------|
| **Avg Latency** | ~7,800 ms | ~7,700 ms |
| **Total Cost** | ~$0.029 | ~$0.030 |
| **Cost Savings** | **~4.5%** | — |

**Example Model Distribution (Router, Balanced):**
- `gpt-5-nano`: 5 requests (50%) — classification, summarisation, planning
- `gpt-5-mini`: 2 requests (20%) — FAQ, data extraction
- `gpt-oss-120b`: 2 requests (20%) — long-context, creative tasks
- `gpt-4.1-mini`: 1 request (10%) — complex debugging & reasoning

**Key Insights:**
- **Router rows (blue)** show which underlying model was selected
- **Standard rows (grey)** always use the same fixed model (`gpt-5-nano`)
- Simple prompts route to efficient nano models; complex prompts route to mini or specialised models
- 4 distinct models used across 10 prompts = intelligent optimisation at work
- Quality mode delivered the biggest savings (~14%) by choosing faster models for simple prompts

---

## 🏗️ Project Structure

```
router-demo-app/
├── src/
│   ├── components/
│   │   ├── DistributionChart.tsx    # Model distribution bar chart
│   │   ├── ErrorBoundary.tsx        # Graceful crash handling
│   │   ├── MetadataBadge.tsx        # Current config display
│   │   ├── PromptSelector.tsx       # Prompt selection + custom input
│   │   ├── ResultsTable.tsx         # Results comparison table
│   │   ├── RunControls.tsx          # Action buttons
│   │   └── StatsCards.tsx           # Aggregate statistics
│   ├── config/
│   │   ├── endpoints.ts             # API endpoint configuration
│   │   ├── pricing.ts               # Model pricing data
│   │   └── prompts.ts               # 10 test prompts
│   ├── hooks/
│   │   ├── useCompletion.ts         # API call logic + error handling
│   │   └── useResults.ts            # Results state management
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── App.tsx                      # Main application
│   ├── main.tsx                     # Entry point with ErrorBoundary
│   └── index.css                    # Tailwind CSS entry
├── .env.example                     # Environment variable template
├── .gitignore                       # Git ignore rules
├── .vscode/
│   └── extensions.json              # Recommended VS Code extensions
├── index.html                       # HTML entry with security headers
├── package.json                     # Dependencies and scripts
├── setup.ps1                        # Windows setup script (PowerShell)
├── setup.sh                         # macOS/Linux setup script (Bash)
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build configuration
└── README.md
```

---

## 🔧 Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build (TypeScript + Vite) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type-check (no emit) |
| `npm run setup` | Run platform-appropriate setup script |

### Build for Production

```bash
npm run build    # output in dist/
npm run preview  # preview at http://localhost:4173
```

---

## 📚 Key Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type-safe development |
| Vite | 7 | Build tool and dev server |
| Tailwind CSS | 4 | Utility-first styling |
| Recharts | 3 | Chart visualisations |
| Azure OpenAI API | 2024-10-21 | Model Router and completions |

---

## 🔐 Security

### Implemented Measures

- **Error boundary** — Catches rendering crashes; shows a user-friendly fallback
- **Sanitised error messages** — Raw API errors are never exposed in production builds
- **Request timeouts** — 60-second `AbortController` timeout prevents hanging requests
- **Input validation** — Prompt length capped at 50,000 characters; empty prompts rejected
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` in HTML
- **Hidden source maps** — Production builds use `sourcemap: 'hidden'`
- **DNS rebinding protection** — Dev server restricted to `localhost` / `127.0.0.1`
- **External link safety** — All external links use `target="_blank" rel="noopener noreferrer"`
- **Gitignored secrets** — `.env.local` and all `.env.*` variants excluded from version control

### ⚠️ Important: Client-Side API Keys

This demo calls Azure OpenAI **directly from the browser** for simplicity. This is acceptable for **local development and personal demos only**.

For any **production or publicly-deployed** scenario:
- Proxy requests through a backend server
- Use [Managed Identity](https://learn.microsoft.com/azure/ai-services/openai/how-to/managed-identity) instead of API keys
- Apply server-side rate limiting and authentication

---

## 🐛 Troubleshooting

### Buttons Disabled / UI Unresponsive

1. Verify `.env.local` has correct **base URLs** (not full API paths):
   - ✅ `https://your-resource.cognitiveservices.azure.com`
   - ❌ `https://.../openai/deployments/.../chat/completions`
2. Restart the dev server: `Ctrl+C` then `npm run dev`

### 401 Unauthorised

1. Verify API keys in `.env.local` are correct and active
2. Check keys in [Azure Portal](https://portal.azure.com) or [Foundry Portal](https://ai.azure.com)
3. Ensure no extra whitespace or quotes around key values

### 404 Not Found

1. Verify deployment names match exactly (case-sensitive)
2. Confirm deployments exist in the correct resource/project
3. Check that Model Router is deployed

### Environment Variables Not Loading

1. **Restart the dev server** — Vite does not hot-reload `.env` changes
2. Hard-refresh the browser (`Ctrl+Shift+R`)
3. Confirm all variables are prefixed with `VITE_`

---

## 📖 Resources

| Resource | Link |
|----------|------|
| Model Router Concepts | [learn.microsoft.com](https://learn.microsoft.com/azure/ai-foundry/openai/concepts/model-router) |
| Model Router How-To | [learn.microsoft.com](https://learn.microsoft.com/azure/ai-foundry/openai/how-to/model-router) |
| Foundry Portal | [ai.azure.com](https://ai.azure.com) |
| Model Router Catalog | [ai.azure.com/catalog](https://ai.azure.com/catalog/models/model-router) |
| Azure OpenAI Service | [azure.microsoft.com](https://azure.microsoft.com/products/ai-services/openai-service) |
| Azure AI Foundry Docs | [learn.microsoft.com](https://learn.microsoft.com/azure/ai-foundry) |

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

**Built with Microsoft Foundry Model Router** · Powered by Azure OpenAI · UI with Tailwind CSS + Recharts

Made with ❤️ for the Azure AI community

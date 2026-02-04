# 🔀 Azure AI Foundry Model Router Demo

An interactive web application demonstrating the power of **Azure AI Foundry Model Router** - an intelligent routing system that automatically selects the optimal language model for each request based on complexity, reasoning requirements, and task type.

> **Compare intelligent routing vs fixed model deployments in real-time!**

![Model Router Demo](https://img.shields.io/badge/Azure-AI_Foundry-0078D4?style=for-the-badge&logo=microsoft-azure)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite)

## 📸 Screenshots

### Application Overview
Select prompts, choose routing modes, and run comparisons in a clean, intuitive interface:

![Application Interface](screenshots/app-prompt-selected.png)

### Real-time Results & Analytics
See instant comparisons between Model Router and standard deployments:

![Results Comparison](screenshots/app-complete-results.png)

### Model Distribution Visualization
Watch the router intelligently distribute requests across different models based on complexity:

![Full Results Distribution](screenshots/app-full-distribution.png)

---

## 🌟 Features

- **🔀 Intelligent Model Routing** - Watch as Model Router selects the best model for each prompt (GPT-5, GPT-4.1, O4-mini, etc.)
- **📊 Real-time Comparison** - Run prompts through both router and standard deployments side-by-side
- **💰 Cost Analytics** - Track estimated costs and see potential savings with smart routing
- **⚡ Performance Metrics** - Monitor latency, token usage, and model distribution
- **🎯 Routing Modes** - Test Balanced, Cost-Optimized, and Quality-Optimized routing strategies
- **📈 Visual Analytics** - Charts showing model distribution and comparative statistics
- **🔍 Comprehensive Testing** - Run individual prompts or batch test entire prompt sets

---

## 🚀 What is Azure AI Foundry Model Router?

Model Router is a **trained language model** that intelligently routes your prompts in real-time to the most suitable large language model (LLM). Think of it as a smart dispatcher that:

- 🧠 **Analyzes prompt complexity** in real-time (reasoning, task type, attributes)
- 💡 **Selects optimal models** from a pool of 18+ underlying models
- 💵 **Optimizes costs** by using smaller models when sufficient, larger models when needed
- ⚡ **Reduces latency** while maintaining comparable quality
- 🎯 **Supports multiple modes**: Balanced (default), Cost, Quality

### Supported Models (2025-11-18 version)

The latest Model Router supports **18 underlying models** including:

- **OpenAI Models**: GPT-5, GPT-5-mini, GPT-5-nano, GPT-4.1, GPT-4.1-mini, GPT-4.1-nano, O4-mini
- **Reasoning Models**: GPT-5-chat, Grok-4, Grok-4-fast-reasoning
- **Open Source Models**: DeepSeek-V3.1, GPT-OSS-120B, Llama-4-Maverick
- **Anthropic Claude**: Claude-Haiku-4-5, Claude-Opus-4-1, Claude-Sonnet-4-5

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Azure AI Foundry account** with:
  - Model Router deployment
  - At least one standard model deployment (for comparison)
  - API keys for both deployments

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd router-demo-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Azure credentials:

```env
# Azure Model Router Deployment
VITE_ROUTER_ENDPOINT=https://your-resource.cognitiveservices.azure.com
VITE_ROUTER_API_KEY=your-api-key-here
VITE_ROUTER_DEPLOYMENT=model-router

# Standard Model Deployment (for comparison)
VITE_STANDARD_ENDPOINT=https://your-resource.cognitiveservices.azure.com
VITE_STANDARD_API_KEY=your-api-key-here
VITE_STANDARD_DEPLOYMENT=gpt-4.1
```

> ⚠️ **Security Note**: Never commit `.env.local` - it's already in `.gitignore`

### 4. Get Azure Credentials

#### From Azure Portal:
1. Navigate to your **Azure OpenAI** resource
2. Go to **Keys and Endpoints**
3. Copy the **base URL** (e.g., `https://your-resource.cognitiveservices.azure.com`)
4. Copy one of the **API Keys**
5. Note your **deployment names** from the Deployments tab

#### From Azure AI Foundry Portal:
1. Go to [ai.azure.com](https://ai.azure.com)
2. Open your project
3. Navigate to **Deployments**
4. Confirm you have `model-router` deployed
5. Get connection details from **Project Settings**

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or next available port)

---

## 🎮 Usage Guide

### Quick Start

1. **Select a Prompt** - Choose from pre-configured prompts in the left sidebar (categorized by complexity)
2. **Choose Action**:
   - **🔀 Run Router** - Test model router only
   - **📌 Run Standard** - Test standard deployment only
   - **⚡ Run Both** - Compare side-by-side
   - **🚀 Run All Prompts** - Batch test all prompts
3. **Review Results** - Analyze model selection, latency, costs in the results table
4. **Compare Metrics** - Check stats cards and distribution charts

### Routing Modes

Test different routing strategies using the **Routing Mode** dropdown:

- **🎯 Balanced (Default)** - Optimal balance of cost and quality (1-2% quality range)
- **💰 Cost-Optimized** - Maximize cost savings (5-6% quality range)
- **💎 Quality-Optimized** - Prioritize maximum accuracy (ignores cost)

> 📝 **Note**: Routing mode is passed to the API but actual routing behavior is configured in Azure AI Foundry Portal

---

## 📊 Understanding the Results

### Results Table

| Column | Description |
|--------|-------------|
| **Prompt** | The input text sent to the model |
| **Path** | Router vs Standard deployment |
| **Routing Mode** | The routing strategy used (Balanced/Cost/Quality) |
| **Chosen Model** | The actual model selected (reveals routing decisions) |
| **Latency** | Response time in milliseconds |
| **Tokens** | Total tokens used (prompt + completion) |
| **Est. Cost** | Calculated cost based on model pricing |

### Key Insights

- **Router rows (blue)**: Shows which underlying model was selected
- **Standard rows (gray)**: Always uses the same fixed model
- **Model variation**: More model variety in router = better optimization
- **Cost comparison**: Compare total costs in stats cards

---

## 🏗️ Project Structure

```
router-demo-app/
├── src/
│   ├── components/          # React components
│   │   ├── DistributionChart.tsx    # Model distribution visualization
│   │   ├── MetadataBadge.tsx        # Config display
│   │   ├── PromptSelector.tsx       # Prompt selection UI
│   │   ├── ResultsTable.tsx         # Results display
│   │   ├── RunControls.tsx          # Action buttons
│   │   └── StatsCards.tsx           # Aggregate statistics
│   ├── config/              # Configuration files
│   │   ├── endpoints.ts             # API endpoints config
│   │   ├── pricing.ts               # Model pricing data
│   │   └── prompts.ts               # Test prompt sets
│   ├── hooks/               # Custom React hooks
│   │   ├── useCompletion.ts         # API call logic
│   │   └── useResults.ts            # Results management
│   ├── types/               # TypeScript types
│   │   └── index.ts                 # Type definitions
│   ├── App.tsx              # Main application
│   └── main.tsx             # Entry point
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── README.md                # This file
```

---

## 🔧 Development

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📚 Key Technologies

- **React 19.2** - UI framework with latest features
- **TypeScript 5.9** - Type-safe development
- **Vite 7.2** - Lightning-fast build tool
- **Tailwind CSS 4.1** - Utility-first styling
- **Recharts 3.7** - Chart visualizations
- **Azure OpenAI API** - Model Router & completions

---

## 🔐 Security Best Practices

✅ **Implemented Security Measures:**
- API keys stored in `.env.local` (gitignored)
- No hardcoded credentials in source code
- Environment variables prefixed with `VITE_` for Vite security
- `.env.local` excluded from version control

⚠️ **Important Reminders:**
- Never commit `.env.local` to version control
- Rotate API keys regularly in Azure Portal
- Use separate keys for development and production
- Monitor API usage in Azure Portal

---

## 🐛 Troubleshooting

### Application Not Loading / Buttons Disabled

**Problem**: UI appears unresponsive, buttons are disabled
**Solution**: 
1. Verify `.env.local` has correct **base URLs only** (no paths)
   - ✅ Correct: `https://your-resource.cognitiveservices.azure.com`
   - ❌ Wrong: `https://.../openai/deployments/.../chat/completions`
2. Restart dev server: `Ctrl+C` then `npm run dev`

### API Errors (401 Unauthorized)

**Problem**: Getting authentication errors
**Solution**:
1. Verify API keys in `.env.local` are correct
2. Check keys are active in Azure Portal
3. Ensure no extra spaces or quotes around keys

### API Errors (404 Not Found)

**Problem**: Deployment not found errors
**Solution**:
1. Verify deployment names in `.env.local` match Azure Portal exactly
2. Check deployments are in the same region/resource
3. Confirm Model Router is deployed (version 2025-11-18 recommended)

### CORS Errors

**Problem**: Cross-origin request blocked
**Solution**: This shouldn't happen with Azure OpenAI, but if it does:
1. Verify you're using correct endpoints
2. Check Azure OpenAI resource settings

### Environment Variables Not Working

**Problem**: Changes to `.env.local` not reflected
**Solution**:
1. Restart the dev server (Vite doesn't hot-reload env vars)
2. Clear browser cache (`Ctrl+Shift+R`)
3. Verify variables are prefixed with `VITE_`

---

## 📖 Additional Resources

### Official Documentation
- [Model Router Concepts](https://learn.microsoft.com/azure/ai-foundry/openai/concepts/model-router)
- [Model Router How-To Guide](https://learn.microsoft.com/azure/ai-foundry/openai/how-to/model-router)
- [Azure AI Foundry Portal](https://ai.azure.com)
- [Model Router Catalog](https://ai.azure.com/catalog/models/model-router)

### Learn More
- [Azure OpenAI Service](https://azure.microsoft.com/products/ai-services/openai-service)
- [Microsoft Foundry Documentation](https://learn.microsoft.com/azure/ai-foundry)
- [Azure AI Studio](https://learn.microsoft.com/azure/ai-studio)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is provided as a demonstration/sample application. Check with your organization for licensing requirements.

---

## 🙏 Acknowledgments

- Built with Azure AI Foundry Model Router
- Powered by OpenAI, Anthropic, DeepSeek, and Meta models
- UI components styled with Tailwind CSS
- Charts powered by Recharts

---

## 📧 Support

For issues related to:
- **This demo app**: Open a GitHub issue
- **Azure AI Foundry**: Check [Microsoft Docs](https://learn.microsoft.com/azure/ai-foundry)
- **Azure Support**: Contact [Azure Support](https://azure.microsoft.com/support)

---

**🌟 Star this repo if you find it helpful!**

Made with ❤️ for the Azure AI community

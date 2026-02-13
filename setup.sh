#!/usr/bin/env bash
# =============================================================================
# Setup script for the Azure Foundry Model Router Demo App
# =============================================================================
# Usage:
#   chmod +x setup.sh
#   ./setup.sh              # install deps + configure env
#   ./setup.sh --skip-env   # skip env file creation
#   ./setup.sh --start-dev  # install, configure, then start dev server
# =============================================================================

set -euo pipefail

# ── Options ──────────────────────────────────────────────────────────────────
SKIP_ENV=false
START_DEV=false
for arg in "$@"; do
  case "$arg" in
    --skip-env)  SKIP_ENV=true ;;
    --start-dev) START_DEV=true ;;
    -h|--help)
      echo "Usage: ./setup.sh [--skip-env] [--start-dev]"
      exit 0
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colours / helpers ────────────────────────────────────────────────────────
step()  { printf "\n\033[36m▶  %s\033[0m\n" "$1"; }
ok()    { printf "   \033[32m✔ %s\033[0m\n" "$1"; }
warn()  { printf "   \033[33m⚠ %s\033[0m\n" "$1"; }
fail()  { printf "   \033[31m✘ %s\033[0m\n" "$1"; }

# ── Banner ───────────────────────────────────────────────────────────────────
echo ""
printf "\033[35m╔══════════════════════════════════════════════════════════════╗\033[0m\n"
printf "\033[35m║   Azure Foundry Model Router Demo — Setup                   ║\033[0m\n"
printf "\033[35m╚══════════════════════════════════════════════════════════════╝\033[0m\n"

# ── 1. Check Node.js ─────────────────────────────────────────────────────────
step "Checking Node.js..."
if ! command -v node &>/dev/null; then
  fail "Node.js is not installed."
  echo "   Install from https://nodejs.org (LTS recommended)."
  exit 1
fi
NODE_VERSION=$(node --version | sed 's/^v//')
MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
if [ "$MAJOR" -lt 18 ]; then
  fail "Node.js v$NODE_VERSION detected. v18 or later is required."
  exit 1
fi
ok "Node.js v$NODE_VERSION"

# ── 2. Check npm ─────────────────────────────────────────────────────────────
step "Checking npm..."
if ! command -v npm &>/dev/null; then
  fail "npm is not installed."
  exit 1
fi
NPM_VERSION=$(npm --version)
ok "npm v$NPM_VERSION"

# ── 3. Install dependencies ─────────────────────────────────────────────────
step "Installing dependencies..."
npm install
ok "Dependencies installed"

# ── 4. Environment variables ────────────────────────────────────────────────
if [ "$SKIP_ENV" = false ]; then
  step "Configuring environment variables..."
  ENV_FILE="$SCRIPT_DIR/.env.local"
  ENV_EXAMPLE="$SCRIPT_DIR/.env.example"

  if [ -f "$ENV_FILE" ]; then
    ok ".env.local already exists — skipping."
  elif [ -f "$ENV_EXAMPLE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    warn ".env.local created from .env.example."
    echo "   → Edit .env.local and add your Azure API keys before running the app."
  else
    warn ".env.example not found. Create a .env.local manually with your API keys."
  fi
fi

# ── 5. Validate TypeScript compilation ───────────────────────────────────────
step "Validating TypeScript..."
if npx tsc --noEmit >/dev/null 2>&1; then
  ok "TypeScript compiles cleanly"
else
  warn "TypeScript reported errors (non-blocking). Run 'npx tsc --noEmit' for details."
fi

# ── 6. Summary ───────────────────────────────────────────────────────────────
echo ""
printf "\033[32m╔══════════════════════════════════════════════════════════════╗\033[0m\n"
printf "\033[32m║   Setup complete!                                           ║\033[0m\n"
printf "\033[32m╚══════════════════════════════════════════════════════════════╝\033[0m\n"
echo ""
echo "  Quick-start commands:"
echo "    npm run dev       Start the dev server"
echo "    npm run build     Production build"
echo "    npm run lint      Run ESLint"
echo "    npm run preview   Preview production build"
echo ""

# ── 7. Optionally start dev server ──────────────────────────────────────────
if [ "$START_DEV" = true ]; then
  step "Starting development server..."
  npm run dev
fi

#!/usr/bin/env bash
# ==============================================================================
# Script: deploy.sh
# Purpose: Zero-Downtime Deployment Automation for PolishedByAnshika on Ubuntu EC2
# Usage: bash deploy/scripts/deploy.sh
# ==============================================================================

set -euo pipefail

# Configuration
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEB_DIST_DIR="${APP_DIR}/client/dist"
HEALTH_CHECK_URL="http://127.0.0.1:5001/api/health"

echo "=================================================="
echo "🚀 Starting Deployment for PolishedByAnshika"
echo "📂 Project Directory: ${APP_DIR}"
echo "🕒 Timestamp        : $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="

cd "${APP_DIR}"

# ─── 1. Pull Latest Code ─────────────────────────────────────────────────────
echo "📥 1/5 Pulling latest code from origin/main..."
git fetch origin main
git reset --hard origin/main

# ─── 2. Backend Dependencies ─────────────────────────────────────────────────
echo "📦 2/5 Installing server production dependencies..."
cd "${APP_DIR}/server"
npm install --omit=dev

# ─── 3. Frontend Build ───────────────────────────────────────────────────────
echo "🔨 3/5 Installing client dependencies & building frontend..."
cd "${APP_DIR}/client"
npm install
npm run build

# ─── 4. Set Frontend Static Asset Permissions for Nginx ─────────────────────
echo "🔒 4/5 Setting static asset permissions for Nginx (${WEB_DIST_DIR})..."
if [ -d "${WEB_DIST_DIR}" ]; then
  if [ "$EUID" -ne 0 ]; then
    sudo chown -R www-data:www-data "${WEB_DIST_DIR}"
    sudo chmod -R 755 "${WEB_DIST_DIR}"
  else
    chown -R www-data:www-data "${WEB_DIST_DIR}"
    chmod -R 755 "${WEB_DIST_DIR}"
  fi
fi

# ─── 5. Reload Backend via PM2 (Zero-Downtime Cluster Reload) ────────────────
echo "🔄 5/5 Reloading PM2 cluster with zero downtime..."
cd "${APP_DIR}"
mkdir -p "${APP_DIR}/logs"

if pm2 describe polishedbyanshika-api >/dev/null 2>&1; then
  pm2 reload ecosystem.config.js --env production
else
  pm2 start ecosystem.config.js --env production
fi
pm2 save

# ─── 6. Verify Health Check ──────────────────────────────────────────────────
echo "🩺 Verifying API health check at ${HEALTH_CHECK_URL}..."
sleep 3

STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_CHECK_URL}" || echo "000")

if [ "${STATUS_CODE}" -eq 200 ]; then
  echo "✅ API Health Check PASSED (HTTP 200 OK)!"
else
  echo "❌ Warning: Health check returned HTTP ${STATUS_CODE}. Check PM2 logs:"
  pm2 logs polishedbyanshika-api --lines 20 --nostream
  exit 1
fi

echo ""
echo "=================================================="
echo "🎉 Deployment Completed Successfully!"
echo "🌐 Site is live with zero downtime."
echo "=================================================="

#!/usr/bin/env bash
# ==============================================================================
# Script: setup-swap.sh
# Purpose: Create & Enable 2GB Swap Memory with vm.swappiness=10 on Ubuntu EC2
# Usage: sudo bash setup-swap.sh
# ==============================================================================

set -euo pipefail

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Error: Please run this script as root (use sudo)."
  exit 1
fi

SWAP_FILE="/swapfile"
SWAP_SIZE="2G"

echo "=================================================="
echo "🚀 Setting up ${SWAP_SIZE} Swap Memory on Ubuntu EC2"
echo "=================================================="

# 1. Check if swap already exists
if swapon --show | grep -q "${SWAP_FILE}"; then
  echo "⚠️ Swap file '${SWAP_FILE}' is already active."
  swapon --show
  free -h
  exit 0
fi

# 2. Allocate 2GB file (fallback to dd if fallocate fails)
echo "📦 Allocating ${SWAP_SIZE} for ${SWAP_FILE}..."
if ! fallocate -l "${SWAP_SIZE}" "${SWAP_FILE}" 2>/dev/null; then
  echo "⚠️ fallocate failed, falling back to dd..."
  dd if=/dev/zero of="${SWAP_FILE}" bs=1M count=2048 status=progress
fi

# 3. Secure file permissions (root read/write only)
echo "🔒 Securing permissions (chmod 600)..."
chmod 600 "${SWAP_FILE}"

# 4. Set up Linux swap area & enable
echo "⚙️ Initializing swap format..."
mkswap "${SWAP_FILE}"

echo "🔄 Activating swap..."
swapon "${SWAP_FILE}"

# 5. Persist swap in /etc/fstab
if ! grep -q "${SWAP_FILE}" /etc/fstab; then
  echo "💾 Appending to /etc/fstab for boot persistence..."
  echo "${SWAP_FILE} none swap sw 0 0" >> /etc/fstab
fi

# 6. Tune vm.swappiness=10 (avoids unnecessary swap writes on EC2)
echo "⚡ Tuning swappiness to 10..."
sysctl vm.swappiness=10
if ! grep -q "vm.swappiness=10" /etc/sysctl.conf; then
  echo "vm.swappiness=10" >> /etc/sysctl.conf
fi

echo ""
echo "=================================================="
echo "✅ 2GB Swap Memory Successfully Configured!"
echo "=================================================="
swapon --show
echo ""
free -h


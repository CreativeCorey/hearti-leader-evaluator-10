#!/bin/bash
# HEARTI — deploy to Bluehost via FTP
# Usage:
#   ./deploy.sh           — deploy hearti.app only (default)
#   ./deploy.sh hearti    — deploy hearti.app only
#   ./deploy.sh all       — deploy hearti.app + heartiquotient.com + prismwork.com
#
# Requires in .env.local (never committed to git):
#   BLUEHOST_FTP_HOST, BLUEHOST_FTP_USER, BLUEHOST_FTP_PASS        (hearti.app)
#   HQ_FTP_USER, HQ_FTP_PASS                                        (heartiquotient.com)
#   PW_FTP_USER, PW_FTP_PASS                                        (prismwork.com)

set -e

TARGET="${1:-hearti}"

# Load credentials from .env.local
export $(grep -v '^#' .env.local | xargs)

# ─── Deploy hearti.app ────────────────────────────────────────────────────────
deploy_hearti() {
  echo "Building..."
  npm run build

  echo "Deploying hearti.app..."

  curl -T dist/index.html \
    "ftp://${BLUEHOST_FTP_HOST}/index.html" \
    --user "${BLUEHOST_FTP_USER}:${BLUEHOST_FTP_PASS}" \
    --silent --show-error

  curl -T dist/favicon.svg \
    "ftp://${BLUEHOST_FTP_HOST}/favicon.svg" \
    --user "${BLUEHOST_FTP_USER}:${BLUEHOST_FTP_PASS}" \
    --silent --show-error

  echo "→ Cleaning stale assets..."
  for ext in js css; do
    while IFS= read -r line; do
      filename=$(echo "$line" | awk '{print $NF}')
      if [ ! -f "dist/assets/$filename" ]; then
        echo "  Removing stale: assets/$filename"
        curl -s "ftp://${BLUEHOST_FTP_HOST}/assets/$filename" \
          --user "${BLUEHOST_FTP_USER}:${BLUEHOST_FTP_PASS}" \
          -Q "DELE assets/$filename" || true
      fi
    done < <(curl -s --list-only "ftp://${BLUEHOST_FTP_HOST}/assets/" \
      --user "${BLUEHOST_FTP_USER}:${BLUEHOST_FTP_PASS}" | grep "\.$ext$")
  done

  for file in dist/assets/*; do
    filename=$(basename "$file")
    echo "  Uploading assets/$filename..."
    curl -T "$file" \
      "ftp://${BLUEHOST_FTP_HOST}/assets/$filename" \
      --user "${BLUEHOST_FTP_USER}:${BLUEHOST_FTP_PASS}" \
      --ftp-create-dirs \
      --silent --show-error
  done

  echo "✓ hearti.app deployed"
}

# ─── Deploy heartiquotient.com ───────────────────────────────────────────────
deploy_heartiquotient() {
  echo "Deploying heartiquotient.com..."
  HEARTIQUOTIENT_DIR="/Users/pworklaptop/PrismWork/Marketing/website/updated google/heartiquotient"

  for file in "$HEARTIQUOTIENT_DIR"/*.html; do
    filename=$(basename "$file")
    echo "  Uploading $filename..."
    curl -T "$file" \
      "ftp://${BLUEHOST_FTP_HOST}/${filename}" \
      --user "${HQ_FTP_USER}:${HQ_FTP_PASS}" \
      --ftp-create-dirs \
      --silent --show-error
  done

  echo "✓ heartiquotient.com deployed"
}

# ─── Deploy prismwork.com ────────────────────────────────────────────────────
deploy_prismwork() {
  echo "Deploying prismwork.com..."
  PRISMWORK_DIR="/Users/pworklaptop/PrismWork/Marketing/website/updated google/prismwork"

  for file in "$PRISMWORK_DIR"/*.html; do
    filename=$(basename "$file")
    echo "  Uploading $filename..."
    curl -T "$file" \
      "ftp://${BLUEHOST_FTP_HOST}/${filename}" \
      --user "${PW_FTP_USER}:${PW_FTP_PASS}" \
      --ftp-create-dirs \
      --silent --show-error
  done

  echo "✓ prismwork.com deployed"
}

# ─── Run ─────────────────────────────────────────────────────────────────────
case "$TARGET" in
  hearti)
    deploy_hearti
    ;;
  all)
    deploy_hearti
    deploy_heartiquotient
    deploy_prismwork
    echo "✓ All deployments complete"
    ;;
  *)
    echo "Unknown target: $TARGET"
    echo "Usage: ./deploy.sh [hearti|all]"
    exit 1
    ;;
esac

#!/usr/bin/env bash
# deploy.sh - script helper to run on the server after extracting the ZIP
# Usage: cd /path/to/app && bash deploy.sh

set -euo pipefail

echo "Running server-side deploy script..."

# Ensure we are in project root (script assumes you run it from project folder)
# Install dependencies (production)
if [ -f package-lock.json ]; then
  echo "Installing dependencies with npm ci --production..."
  npm ci --production
else
  echo "Installing dependencies with npm install --production..."
  npm install --production
fi

# Build (if .next not provided)
if [ -d .next ]; then
  echo ".next exists, skipping build step"
else
  echo "Running npm run build..."
  npm run build
fi

# Create uploads folders and set permissions
echo "Creating uploads folders and setting permissions..."
mkdir -p public/uploads/{banners,donations,gallery,interest-pages,services,team,general}
chmod -R 775 public/uploads || true

# Provide next steps for cPanel/Process manager
cat <<'EOF'
Done. Next steps (pick one):

1) If you use cPanel 'Setup Node.js App':
   - In cPanel, Setup Node.js App -> select Application root = this folder
   - Application startup: `npm start` (or `next start` if you prefer)
   - Add required environment variables (DB, etc.) via cPanel UI
   - Start the app from cPanel

2) If you use pm2 or a custom process manager (SSH):
   - pm2 start "npm -- start" --name parroquia
   - or: npm run start (background with screen/tmux)

3) Test: open the subdomain URL and verify endpoints and uploads.
EOF

exit 0

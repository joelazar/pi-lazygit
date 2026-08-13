#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEMO="${DEMO_DIR:-/tmp/pi-lazygit-demo}"

rm -rf "$DEMO"
mkdir -p "$DEMO/src" "$DEMO/.pi/extensions"
ln -sf "$ROOT/index.ts" "$DEMO/.pi/extensions/pi-lazygit.ts"

cd "$DEMO"
git init -q
git config user.name "demo"
git config user.email "demo@example.com"
echo ".pi/" > .git/info/exclude

cat > README.md <<'EOF'
# checkout-service

Session handling for the checkout flow.
EOF

cat > src/auth.ts <<'EOF'
export function parseToken(header: string): string {
  return header.slice("Bearer ".length);
}
EOF

cat > src/index.ts <<'EOF'
import { parseToken } from "./auth";

export function handler(header: string): string {
  return parseToken(header);
}
EOF

git add -A
git commit -qm "initial checkout service"

cat > src/auth.ts <<'EOF'
const CACHE = new Map<string, Session>();

export function parseToken(header: string): string {
  return header.slice("Bearer ".length);
}

export async function authenticate(header: string): Promise<Session> {
  const token = parseToken(header);
  const cached = CACHE.get(token);
  if (cached) return cached;

  const session = await fetchSession(token);
  CACHE.set(token, session);
  return session;
}
EOF

cat > src/session.ts <<'EOF'
export interface Session {
  userId: string;
  expiresAt: number;
}

export async function fetchSession(token: string): Promise<Session> {
  const res = await fetch(`/sessions/${token}`);
  return res.json();
}
EOF

CONFIG="${DEMO}-config"
rm -rf "$CONFIG"
mkdir -p "$CONFIG"
cat > "$CONFIG/config.yml" <<'CFG'
gui:
  theme:
    selectedLineBgColor:
      - "#313244"
    selectedRangeBgColor:
      - "#313244"
  showRandomTip: false
  showCommandLog: false
  showBottomLine: false
  nerdFontsVersion: ""
  mouseEvents: false
update:
  method: never
disableStartupPopups: true
notARepository: quit
promptToReturnFromSubprocess: false
CFG

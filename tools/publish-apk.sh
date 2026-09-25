#!/usr/bin/env bash
# Publish the newest APK build of a branch as THE "Latest" GitHub release (tag pl0-latest).
# GitHub's mobile app and the repo page only show a normal (non-pre-release) release in the
# "Latest" slot, so this always recreates one release, never a pre-release, with a fixed tag:
#   https://github.com/pbresta-byte/pl0-app/releases/tag/pl0-latest
# Usage: tools/publish-apk.sh [branch]   (default: current branch). Needs `gh` logged in.
set -euo pipefail
BR="${1:-$(git rev-parse --abbrev-ref HEAD)}"
SHA=$(git rev-parse "origin/$BR" 2>/dev/null || git rev-parse "$BR")
SHORT=${SHA:0:7}
git fetch -q origin "$BR" || true

find_run(){ gh run list --workflow android-apk.yml --branch "$BR" --limit 20 --json databaseId,headSha,status,conclusion \
  -q ".[]|select(.headSha==\"$SHA\")|select(.status==\"completed\" and .conclusion==\"success\")|.databaseId" | head -1; }
RID=$(find_run)
if [ -z "$RID" ]; then
  echo "No successful build for $SHORT yet; starting one..."
  gh workflow run android-apk.yml --ref "$BR"; sleep 8
  NEW=$(gh run list --workflow android-apk.yml --branch "$BR" --limit 1 --json databaseId -q '.[0].databaseId')
  gh run watch "$NEW" --exit-status >/dev/null
  RID=$(find_run)
fi
[ -n "$RID" ] || { echo "Build failed or missing for $SHORT"; exit 1; }

TMP=$(mktemp -d); gh run download "$RID" -n pl0-debug-apk -D "$TMP"
APK="$TMP/app-debug.apk"; [ -f "$APK" ] || { echo "APK not found in build $RID"; exit 1; }

NOTES="Debug build of \`$BR\` at \`$SHORT\` ($(date '+%Y-%m-%d %H:%M')).
Newest first:
$(git log --format='- %s' -8 "$SHA")

Install: download app-debug.apk on the phone and open it; it installs over the previous debug build."

gh release delete pl0-latest --cleanup-tag -y >/dev/null 2>&1 || true
gh release create pl0-latest "$APK" --target "$SHA" --latest \
  --title "PL0 — latest debug APK ($SHORT)" --notes "$NOTES" >/dev/null
gh release view pl0-latest --json url,isPrerelease -q '.url+"  prerelease="+(.isPrerelease|tostring)'

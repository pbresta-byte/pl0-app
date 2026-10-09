#!/usr/bin/env bash
# Build main and publish it as the single "Latest" release (tag pl0-latest).
# Usage: tools/publish-apk.sh   Needs `gh` logged in.
set -euo pipefail
gh workflow run android-apk.yml --ref main; sleep 8
RID=$(gh run list --workflow android-apk.yml --branch main --limit 1 --json databaseId -q '.[0].databaseId')
gh run watch "$RID" --exit-status >/dev/null
gh release view pl0-latest --json url,isPrerelease -q '.url+"  prerelease="+(.isPrerelease|tostring)'

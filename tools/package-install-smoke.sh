#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
smoke_dir="$(mktemp -d "${TMPDIR:-/tmp}/sushi-package-install.XXXXXX")"
trap 'rm -rf "$smoke_dir"' EXIT

app_dir="$smoke_dir/app"
mkdir "$app_dir"
cp -R "$repo_dir/tests/package-install/." "$app_dir/"

cd "$repo_dir"
tarball="$(npm pack ./dist/sushi --pack-destination "$smoke_dir" --cache .cache/npm --silent)"

cd "$app_dir"
npm install --package-lock=false --no-audit --no-fund --prefer-offline --cache "$repo_dir/.cache/npm" "$smoke_dir/$tarball"
npm run build

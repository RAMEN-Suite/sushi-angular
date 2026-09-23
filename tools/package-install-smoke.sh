#!/usr/bin/env bash
set -euo pipefail

spec="${1:-}"

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
smoke_dir="$(mktemp -d "${TMPDIR:-/tmp}/sushi-package-install.XXXXXX")"
trap 'rm -rf "$smoke_dir"' EXIT

app_dir="$smoke_dir/app"
mkdir "$app_dir"
cp -R "$repo_dir/tests/package-install/." "$app_dir/"

if [ -z "$spec" ]; then
  cd "$repo_dir"
  tarball="$(npm pack ./dist/sushi --pack-destination "$smoke_dir" --cache .cache/npm --silent)"
  spec="$smoke_dir/$tarball"
fi

cd "$app_dir"
npm install --package-lock=false --no-audit --no-fund --prefer-offline --cache "$repo_dir/.cache/npm" --min-release-age=0 "$spec"
npm run build

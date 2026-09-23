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

peers=()
while IFS= read -r name; do
  [ -z "$name" ] && continue
  version="$(node -p "require('$repo_dir/node_modules/$name/package.json').version")"
  peers+=("$name@$version")
done < <(node -p "Object.keys(require('$repo_dir/sushi/package.json').peerDependencies).join('\n')")

cd "$app_dir"

npm_flags=(--package-lock=false --no-audit --no-fund --cache "$repo_dir/.cache/npm")
npm install "${npm_flags[@]}" "${peers[@]}"
npm install "${npm_flags[@]}" --min-release-age=0 "$spec"

npm run build

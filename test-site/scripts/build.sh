#!/bin/bash
set -euo pipefail
echo "build.sh pwd: $(pwd)"

set_working_dir_to_test_site () {
  path_to_this_script="$( dirname "${BASH_SOURCE[0]}" )"
  cd "$path_to_this_script/.."
}

set_working_dir_to_test_site

npx jambo build
echo "Finished Jambo build."
ESBUILD_SRC="./node_modules/esbuild/bin/esbuild"
ESBUILD_DEST="./public/static/node_modules/esbuild/bin/esbuild"
if [ ! -f "$ESBUILD_SRC" ]; then
  echo "ERROR: esbuild binary not found at $ESBUILD_SRC."
  ls -la ./node_modules/esbuild/bin || true
  exit 1
fi
if [ ! -f "$ESBUILD_DEST" ]; then
  mkdir -p "$(dirname "$ESBUILD_DEST")"
  ln -sf "$(pwd)/node_modules/esbuild/bin/esbuild" "$ESBUILD_DEST"
fi
chmod u+x "$ESBUILD_SRC" "$ESBUILD_DEST"
echo "Added execute permissions to esbuild binary."
npx grunt webpack
echo "Finished grunt webpack."

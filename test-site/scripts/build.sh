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
if [ ! -f ./public/index.html ]; then
  echo "ERROR: public/index.html missing after Jambo build."
  echo "public dir listing:"
  ls -la ./public | head -n 50
  exit 1
fi
echo "pwd before executing chmod: $(pwd)"
if [ -d ./public/static/node_modules ]; then
  echo "public/static/node_modules listing (first 50):"
  ls -la ./public/static/node_modules | head -n 50
else
  echo "public/static/node_modules does not exist."
fi
chmod u+x ./public/static/node_modules/esbuild/bin/esbuild
echo "Added execute permissions to esbuild binary."
npx grunt webpack
echo "Finished grunt webpack."

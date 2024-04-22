#!/bin/bash

set_working_dir_to_test_site () {
  path_to_this_script="$( dirname "${BASH_SOURCE[0]}" )"
  cd "$path_to_this_script/.."
}

set_working_dir_to_test_site

npx jambo build
chmod u+x ./public/static/node_modules/esbuild/bin/esbuild
npx grunt webpack

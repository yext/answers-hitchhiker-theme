#!/bin/bash

set_working_dir_to_test_site () {
  path_to_this_script="$( dirname "${BASH_SOURCE[0]}" )"
  cd "$path_to_this_script/.."
}

copy_static_files_into_working_dir () {
  cp ../static/Gruntfile.js Gruntfile.js
  cp ../static/package-lock.json package-lock.json
  cp ../static/package.json package.json
  cp ../static/webpack-config.js webpack-config.js
}

set_working_dir_to_test_site
copy_static_files_into_working_dir
npm i
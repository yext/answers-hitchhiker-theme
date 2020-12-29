#!/bin/bash

set_working_dir_to_testing_site_dir () {
  cd "$( dirname "${BASH_SOURCE[0]}" )"
  cd ..
}

copy_static_files_into_working_dir () {
  cp ../static/Gruntfile.js Gruntfile.js
  cp ../static/package-lock.json package-lock.json
  cp ../static/package.json package.json
  cp ../static/webpack-config.js webpack-config.js
}

set_working_dir_to_testing_site_dir
copy_static_files_into_working_dir
jambo build && grunt webpack
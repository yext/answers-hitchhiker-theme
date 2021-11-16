#!/bin/bash

set -e

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

cleanup_custom_cards () {
  rm -rf cards/event-custom
  rm -rf directanswercards/allfields-custom
}

create_custom_cards () {
  npx jambo card --name event-custom --templateCardFolder cards/event-standard
  npx jambo directanswercard --name allfields-custom --templateCardFolder directanswercards/allfields-standard
}

set_working_dir_to_test_site
copy_static_files_into_working_dir
npm i
cleanup_custom_cards
create_custom_cards

# Clear out preexisting pages/config
find pages ! -name index.* -type f -delete
find config ! \( -name index.* -o -name locale_config.json -o -name global_config.json \) -type f -delete

node scripts/create-verticals.js $@

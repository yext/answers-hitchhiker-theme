#!/bin/bash

set_working_dir_to_test_site () {
  path_to_this_script="$( dirname "${BASH_SOURCE[0]}" )"
  cd "$path_to_this_script/.."
}

set_working_dir_to_test_site

rm -rf cards/event-custom
rm -rf directanswercards/allfields-custom

set -e

npx jambo card --name event-custom --templateCardFolder cards/event-standard
npx jambo directanswercard --name allfields-custom --templateCardFolder directanswercards/allfields-standard

node scripts/create-verticals.js

npx jambo build && npx grunt webpack

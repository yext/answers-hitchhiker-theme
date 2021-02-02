#!/bin/bash

set_working_dir_to_test_site () {
  path_to_this_script="$( dirname "${BASH_SOURCE[0]}" )"
  cd "$path_to_this_script/.."
}

set_working_dir_to_test_site

# TODO (SLAP-1066): Make this a full integration test. All vertical pages should be built with the
# `vertical` command. We should use the `card` command as well to create some custom cards.

# Create the vertical page for events
npx jambo vertical --name events --verticalKey events --template vertical-standard --cardName event-standard
sed -i '' -e 's/\/\/ "label": ""/"label": "Events"/g' config/events.json
sed -i '' -e 's/"pageTitle": "Search"/"pageTitle": "Events"/g' config/events.json

npx jambo build && grunt webpack

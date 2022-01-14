#!/bin/bash

set_working_dir_to_test_site () {
  path_to_this_script="$( dirname "${BASH_SOURCE[0]}" )"
  cd "$path_to_this_script/.."
}

set_working_dir_to_test_site
# Use the jambo config for yext sites
cp jambo-yext-sites.json jambo.json

echo "Setup for Yext Sites"
echo "Current jambo.json:"
cat jambo.json
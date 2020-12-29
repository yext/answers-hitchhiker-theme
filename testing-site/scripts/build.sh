#!/bin/bash

set_working_dir_to_testing_site () {
  cd "$( dirname "${BASH_SOURCE[0]}" )"
  cd ..
}

set_working_dir_to_testing_site
jambo build && grunt webpack
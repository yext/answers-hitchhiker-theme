#!/bin/bash

set -e
cd "$( dirname "${BASH_SOURCE[0]}" )"

./setup.sh

cd ..
npx serve -p 8000 public/ & grunt watch

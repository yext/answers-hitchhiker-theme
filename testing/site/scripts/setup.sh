#!/bin/bash

set -e

cd "$( dirname "${BASH_SOURCE[0]}" )"

cp ../../../static/Gruntfile.js ../Gruntfile.js
cp ../../../static/package-lock.json ../package-lock.json
cp ../../../static/package.json ../package.json
cp ../../../static/Gruntfile.js ../Gruntfile.js
cp ../../../static/webpack-config.js ../webpack-config.js
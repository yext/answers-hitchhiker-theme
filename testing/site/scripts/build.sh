#!/bin/bash

set -e
cd "$( dirname "${BASH_SOURCE[0]}" )"

./setup.sh

cd .. 
jambo build && grunt webpack
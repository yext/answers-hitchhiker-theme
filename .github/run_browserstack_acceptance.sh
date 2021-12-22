#!/bin/bash
export BROWSERSTACK_USE_AUTOMATE="1"
export BROWSERSTACK_PROJECT_NAME="Answers Hitchhiker Theme"
GITHUB_BRANCH=${GITHUB_REF#refs/heads/}
export BROWSERSTACK_BUILD_ID="${GITHUB_BRANCH} - ${GITHUB_RUN_ID}"
COMMIT_MSG_TITLE=$(git log -n 1 --pretty=format:%s)
export BROWSERSTACK_TEST_RUN_NAME=$COMMIT_MSG_TITLE
export BROWSER=$1
export CONCURRENCY=$2
export BROWSERSTACK_DEBUG="true"
export BROWSERSTACK_CONSOLE="verbose"
export BROWSERSTACK_NETWORK_LOGS="true"
export BROWSERSTACK_DISPLAY_RESOLUTION="1920x1080"

if [[ -n $CONCURRENCY ]] # If $CONCURRENCY is non-zero
then
  npm run acceptance -- --browsers $BROWSER --concurrency $CONCURRENCY
else
  npm run acceptance -- --browsers $BROWSER 
fi
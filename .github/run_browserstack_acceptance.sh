#!/bin/bash
export BROWSERSTACK_USE_AUTOMATE="1"
export BROWSERSTACK_PROJECT_NAME="Answers Hitchhiker Theme"
GITHUB_BRANCH=${GITHUB_REF#refs/heads/}
export BROWSERSTACK_BUILD_ID="${GITHUB_BRANCH} - ${GITHUB_RUN_ID}"
COMMIT_MSG_TITLE=$(git log -n 1 --pretty=format:%s)
export BROWSERSTACK_TEST_RUN_NAME=$COMMIT_MSG_TITLE
export BROWSER=$1
export BROWSERSTACK_DEBUG="true"
export BROWSERSTACK_CONSOLE="verbose"
export BROWSERSTACK_NETWORK_LOGS="true"
export BROWSERSTACK_DISPLAY_RESOLUTION="1024x768"

if [[ $BROWSER == 'browserstack:ie@11.0' && ($GITHUB_BRANCH == develop || $GITHUB_BRANCH == dev/*) ]]
then
  npm run acceptance -- --browsers $BROWSER --concurrency 3
else
  npm run acceptance -- --browsers $BROWSER 
fi
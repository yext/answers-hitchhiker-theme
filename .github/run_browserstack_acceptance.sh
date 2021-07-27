#!/bin/bash
export BROWSERSTACK_USE_AUTOMATE="1"
export BROWSERSTACK_PROJECT_NAME="Answers Hitchhiker Theme"
GITHUB_BRANCH=${GITHUB_REF#refs/heads/}
export BROWSERSTACK_BUILD_ID="${GITHUB_BRANCH} - ${GITHUB_RUN_ID}"
COMMIT_MSG_TITLE=$(git log -n 1 --pretty=format:%s)
export BROWSERSTACK_TEST_RUN_NAME=$COMMIT_MSG_TITLE

if [[ $GITHUB_BRANCH == release/*
  || $GITHUB_BRANCH == hotfix/*
  || $GITHUB_BRANCH == master
  || $GITHUB_BRANCH == support/* ]]
then
  npm run acceptance -- --browsers browserstack:ie@11.0 browserstack:safari browserstack:firefox
else
  npm run acceptance -- --browsers browserstack:ie@11.0 --concurrency 2
fi
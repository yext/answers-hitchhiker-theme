#!/bin/bash

set -e

# Verifiy that the messages.pot file in the repo is up to date
# If there is a git diff after translations are extracted, the checked-in file is out of date
npm run extract-translations
git diff --exit-code translations/messages.pot > /dev/null # send stdout to /dev/null to reduce clutter in the CI output
diff_exit_code=$?

if test $diff_exit_code -eq 1
then
  echo "Extracted translations are out of date. Run 'npm run extract-translations' and commit the updated pot file."
  exit 1
else
  echo "The messages.pot translation file is up to date."
fi

# Verify that translations are present for all languages
cd translations
if [[ $GITHUB_BASE_REF == refs/heads/release/*
  || $GITHUB_BASE_REF == refs/heads/hotfix/*
  || $GITHUB_BASE_REF == refs/heads/master
  || $GITHUB_BASE_REF == refs/heads/support/* ]]
then
  for po_file in *.po
    do msgcmp $po_file messages.pot
  done
else
  echo "Skipping the verification that all translations are present"
fi
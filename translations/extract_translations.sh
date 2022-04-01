#!/bin/bash

IGNORED_FOLDERS='!{commands,hbshelpers,patches,postupgrade,static,tests,test-site,translations}/**'
OUTPUT_FILE='translations/messages.pot'
npx jambo extract-translations --globs '*/**/*{.hbs,.js}' '!**/node_modules' $IGNORED_FOLDERS --output $OUTPUT_FILE
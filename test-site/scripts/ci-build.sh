#!/bin/bash
set -euo pipefail

CONFIG_PATH="test-site/config/global_config.json"
BACKUP_PATH="$(mktemp)"

# Ensure we return the global_config.json to its original state after the script finishes, even if it exits with an error.
cleanup() {
  if [ -f "$BACKUP_PATH" ]; then
    mv "$BACKUP_PATH" "$CONFIG_PATH"
  fi
}
trap cleanup EXIT

cp "$CONFIG_PATH" "$BACKUP_PATH"
# Disable generative direct answers for CI builds because Percy will mark differences in GDA content as visual diffs.
echo "Disabling generative direct answers in $CONFIG_PATH for CI build."
node -e "const fs=require('fs'); const {parse,stringify}=require('comment-json'); const p='$CONFIG_PATH'; const raw=fs.readFileSync(p,'utf8'); const data=parse(raw); data.useGenerativeDirectAnswers=false; fs.writeFileSync(p,stringify(data,null,2));"

npm run setup-test-site
npm run build-test-site

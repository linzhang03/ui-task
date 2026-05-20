#!/bin/bash

# Check if we're in a valid working directory
if [ "$PWD" = "/" ]; then
  echo "Error: No working directory set. Please set a WORKDIR in your Dockerfile before running this script."
  exit 1
fi

# Install the test toolchain during the test step using the image's preseeded offline npm cache.
cd /tests
export PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
export npm_config_cache=/opt/ui-task-npm-cache

if [ ! -d /opt/ui-task-npm-cache ]; then
  echo "Error: missing offline npm cache at /opt/ui-task-npm-cache"
  exit 1
fi

if [ ! -f /opt/ui-task-test-seed/package-lock.json ]; then
  echo "Error: missing seeded package-lock.json at /opt/ui-task-test-seed/package-lock.json"
  exit 1
fi

rm -rf /tests/node_modules
cp /opt/ui-task-test-seed/package-lock.json /tests/package-lock.json
npm ci --offline --ignore-scripts --no-audit --no-fund

UNIT_EXIT=0
E2E_EXIT=0
npm run test || UNIT_EXIT=$?
npm run test:e2e || E2E_EXIT=$?

# Produce reward file (REQUIRED): pass only if both unit and E2E succeed
if [ "$UNIT_EXIT" -eq 0 ] && [ "$E2E_EXIT" -eq 0 ]; then
  true
else
  false
fi

if [ $? -eq 0 ]; then
    echo 1 > /logs/verifier/reward.txt
else
    echo 0 > /logs/verifier/reward.txt
fi
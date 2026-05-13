#!/bin/bash

# Check if we're in a valid working directory
if [ "$PWD" = "/" ]; then
  echo "Error: No working directory set. Please set a WORKDIR in your Dockerfile before running this script."
  exit 1
fi

# Install test deps, Playwright system deps, and browser at run time (keeps image small).
# Node.js 20 is pre-installed in the Docker image.
cd /tests
npm ci
npx playwright install-deps chromium
npx playwright install chromium

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
# Pin the base image to a specific version tag
FROM python:3.11-slim

# Install Node.js 20.x (required by vitest 2.x and Playwright 1.49)
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

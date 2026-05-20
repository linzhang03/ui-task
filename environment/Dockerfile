# Keep the image on a Playwright-supported Debian release.
FROM python:3.11-slim-bookworm

ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
ENV npm_config_cache=/opt/ui-task-npm-cache

# Install Node.js 20.x (required by vitest 2.x and Playwright 1.49)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        ca-certificates \
        gnupg \
        tmux \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libdrm2 \
        libgbm1 \
        libglib2.0-0 \
        libnspr4 \
        libnss3 \
        libpango-1.0-0 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxkbcommon0 \
        libxrandr2 \
        fonts-liberation \
        fonts-noto-color-emoji \
        fonts-unifont \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/ui-task-test-seed
COPY test-package.json ./package.json
RUN npm install \
    --ignore-scripts \
    && npx playwright install chromium \
    && rm -rf node_modules

WORKDIR /app

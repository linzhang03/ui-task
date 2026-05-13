#!/usr/bin/env bash
set -euo pipefail

# Oracle solution: create the minimal web app at /app for the verifier to serve and test.
cat > /app/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>UI task</title>
  </head>
  <body>
    <h1>Hello, UI task</h1>
    <button id="btn">Click me</button>
    <p id="count-display">click count: 0</p>
    <script>
      let count = 0;
      const btn = document.getElementById('btn');
      const display = document.getElementById('count-display');
      btn.addEventListener('click', () => {
        count++;
        display.textContent = 'click count: ' + count;
      });
    </script>
  </body>
</html>
EOF

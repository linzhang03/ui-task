Build a simple web app at the task root (in the sandbox this is `/app`) so that the main page is served at the root URL (`/`).

Implementation note: wire the button behavior from JavaScript using `addEventListener` after the DOM elements exist. Do not rely on inline `onclick` handlers that reference variables defined in a separate `<script>` block.

The page must have:

1. **Document title** – The `<title>` must be `UI task`.
2. **Heading** – A heading (e.g. `<h1>`) with the exact text `Hello, UI task`.
3. **Button** – A button with the visible label `Click me` that can be focused when clicked.
4. **Click counter** – A `<p>` element with `id="count-display"` that displays `click count: {count}` where `{count}` is the number of times the button has been clicked (starts at `0`). Each click of the button increments the count by one.

Create a file named exactly **`index.html`** at the task root (`/app/index.html`). The verifier will serve `/app` and run unit and E2E tests against this page.

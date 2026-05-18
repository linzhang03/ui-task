Build a simple web app at the task root (in the sandbox this is `/app`) so that the main page is served at the root URL (`/`).

Implementation note: wire the button behavior from JavaScript using `addEventListener` after the required DOM elements are available. A `<script>` placed after those elements, such as at the end of `<body>`, is acceptable. Do not rely on inline `onclick` handlers that reference variables defined in a separate `<script>` block.

The page must have:

1. **Document title** – The `<title>` must be `UI task`.
2. **Heading** – A heading (e.g. `<h1>`) with the exact text `Hello, UI task`.
3. **Primary button** – A button with the visible label `Click me` that can be focused when clicked. It increments the count by one until the count reaches `10`. At `10`, the button must become disabled.
4. **Reset button** – A button with the visible label `Reset count` and `id="reset-button"`. It must be disabled when the count is `0`, enabled after at least one click, and reset the app back to its initial state when clicked.
5. **Click counter** – A `<p>` element with `id="count-display"` that displays `click count: {count}` where `{count}` starts at `0`.
6. **Status text** – A `<p>` element with `id="status-display"` whose text must be:
	- `Ready to be clicked` when the count is `0`
	- `clicked once` when the count is `1`
	- `clicked {count} times` when the count is between `2` and `9`
	- `limit reached` when the count is `10`
7. **Milestone message** – A `<p>` element with `id="milestone-message"` and the exact text `Milestone reached`. It must use the HTML `hidden` attribute to be hidden while the count is below `5`, become visible at `5` or more by removing that attribute, and become hidden again after reset by restoring the `hidden` attribute.

Create a file named exactly **`index.html`** at the task root (`/app/index.html`). The verifier will serve `/app` and run unit and E2E tests against this page.

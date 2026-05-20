Build a simple web app at the task root (in the sandbox this is `/app`) so that the main page is served at the root URL (`/`).

Behavior requirements:

- The page title must be `UI task`.
- The page must show a heading with the exact text `Hello, UI task`.
- The app must accept three integer inputs representing `l`, `r`, and `k`. Their initial values must be `1`, `10`, and `2`.
- The page must include a primary button labeled `Click me`. When the button is clicked, the app must calculate how many integers `y` in the inclusive range `[l, r]` are perfect `k`th powers, where `y` is a perfect `k`th power if there exists an integer `x` such that `y = x^k`. After the click is handled, the `Click me` button must remain focused.
- Count distinct integers `y`, not base values `x`. In particular, when `k` is even, `x` and `-x` produce the same `y`, so those outputs must only be counted once.
- The page must include a reset button labeled `Reset count`. It must be disabled on first render, become enabled after any primary-button click attempt (including invalid input), and reset the app back to its initial state when clicked.
- The result text must start at `perfect kth powers: 0` and update after each successful calculation.
- The status text must start as `Enter integer l, r, and k, then click the button`, change to `Calculated for [{l}, {r}] with k = {k}` after a successful calculation, and use the exact text `l must be less than or equal to r.` when `l > r`.
- A completion message with the exact text `Calculation complete` must include the HTML `hidden` attribute on first render, remove that `hidden` attribute after a successful calculation, and add the `hidden` attribute again after reset or invalid input. Do not rely on CSS-only hiding for this element.

Examples:

- For `l = 8`, `r = 30`, `k = 2`, the result is `3` because the values are `9`, `16`, and `25`.
- For `l = -30`, `r = 30`, `k = 2`, the result is `6` because the values are `0`, `1`, `4`, `9`, `16`, and `25`.
- For `l = -30`, `r = -1`, `k = 2`, the result is `0` because no negative integer is a perfect square.

Verification requirements:

- Create a file named exactly **`index.html`** at the task root (`/app/index.html`).
- The verifier will serve `/app` and run unit and E2E tests against this page.
- Use the following element ids so the verifier can locate the required UI: `l-input`, `r-input`, `k-input`, `reset-button`, `count-display`, `status-display`, and `milestone-message`.
- Put the behavior in a script that runs after the DOM elements are defined, and attach event listeners in script rather than relying on `DOMContentLoaded`.

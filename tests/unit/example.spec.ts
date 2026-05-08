import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, it, expect } from "vitest";
import { screen } from "@testing-library/dom";
import { userEvent } from "@testing-library/user-event";

const currentDir = dirname(fileURLToPath(import.meta.url));
const workspaceIndexHtml = resolve(currentDir, "../../index.html");
const appIndexHtml = existsSync("/app/index.html") ? "/app/index.html" : workspaceIndexHtml;

function loadAppHtml() {
  const html = readFileSync(appIndexHtml, "utf-8");
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  document.body.innerHTML = bodyMatch ? bodyMatch[1] : html;
}

describe("UI task page", () => {
  beforeEach(() => {
    loadAppHtml();
  });

  it("shows the required heading text", () => {
    const heading = screen.getByRole("heading", { name: /hello, ui task/i });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Hello, UI task");
  });

  it("focuses the Click me button after a click", async () => {
    const button = screen.getByRole("button", { name: /click me/i });
    const user = userEvent.setup();
    await user.click(button);
    expect(document.activeElement).toBe(button);
  });
});

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
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;
  const scriptMatches = [...bodyHtml.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

  document.body.innerHTML = bodyHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  for (const match of scriptMatches) {
    const script = document.createElement("script");
    script.textContent = match[1];
    document.body.appendChild(script);
  }

  document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
  window.dispatchEvent(new Event("load"));
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

  it("shows the initial counter state", () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const resetButton = screen.getByRole("button", { name: /reset count/i });
    const counter = document.querySelector("#count-display");
    const status = document.querySelector("#status-display");
    const milestone = document.querySelector("#milestone-message");

    expect(clickButton.hasAttribute("disabled")).toBe(false);
    expect(resetButton.id).toBe("reset-button");
    expect(resetButton.hasAttribute("disabled")).toBe(true);
    expect(counter).toBeTruthy();
    expect(counter?.textContent).toBe("click count: 0");
    expect(status?.textContent).toBe("Ready to be clicked");
    expect(milestone?.textContent).toBe("Milestone reached");
    expect(milestone?.hasAttribute("hidden")).toBe(true);
  });

  it("increments the count and enables reset", async () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const resetButton = screen.getByRole("button", { name: /reset count/i });
    const user = userEvent.setup();

    await user.click(clickButton);

    expect(document.activeElement).toBe(clickButton);
    expect(document.querySelector("#count-display")?.textContent).toBe("click count: 1");
    expect(document.querySelector("#status-display")?.textContent).toBe("clicked once");
    expect(resetButton.hasAttribute("disabled")).toBe(false);
  });

  it("shows the milestone and stops at ten clicks", async () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const user = userEvent.setup();

    for (let index = 0; index < 10; index += 1) {
      await user.click(clickButton);
    }

    expect(document.querySelector("#count-display")?.textContent).toBe("click count: 10");
    expect(document.querySelector("#status-display")?.textContent).toBe("limit reached");
    expect(document.querySelector("#milestone-message")?.textContent).toBe("Milestone reached");
    expect(document.querySelector("#milestone-message")?.hasAttribute("hidden")).toBe(false);
    expect(clickButton.hasAttribute("disabled")).toBe(true);
  });

  it("resets back to the initial state", async () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const resetButton = screen.getByRole("button", { name: /reset count/i });
    const user = userEvent.setup();

    await user.click(clickButton);
    await user.click(clickButton);
    await user.click(resetButton);

    expect(document.querySelector("#count-display")?.textContent).toBe("click count: 0");
    expect(document.querySelector("#status-display")?.textContent).toBe("Ready to be clicked");
    expect(document.querySelector("#milestone-message")?.hasAttribute("hidden")).toBe(true);
    expect(clickButton.hasAttribute("disabled")).toBe(false);
    expect(resetButton.hasAttribute("disabled")).toBe(true);
  });
});

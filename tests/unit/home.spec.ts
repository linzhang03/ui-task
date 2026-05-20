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

  it("shows the initial calculator state", () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const resetButton = screen.getByRole("button", { name: /reset count/i });
    const leftInput = document.querySelector("#l-input") as HTMLInputElement | null;
    const rightInput = document.querySelector("#r-input") as HTMLInputElement | null;
    const kthInput = document.querySelector("#k-input") as HTMLInputElement | null;
    const result = document.querySelector("#count-display");
    const status = document.querySelector("#status-display");
    const milestone = document.querySelector("#milestone-message");

    expect(clickButton.hasAttribute("disabled")).toBe(false);
    expect(resetButton.id).toBe("reset-button");
    expect(resetButton.hasAttribute("disabled")).toBe(true);
    expect(leftInput?.value).toBe("1");
    expect(rightInput?.value).toBe("10");
    expect(kthInput?.value).toBe("2");
    expect(result).toBeTruthy();
    expect(result?.textContent).toBe("perfect kth powers: 0");
    expect(status?.textContent).toBe("Enter integer l, r, and k, then click the button");
    expect(milestone?.textContent).toBe("Calculation complete");
    expect(milestone?.hasAttribute("hidden")).toBe(true);
  });

  it("calculates the count for the default inputs and enables reset", async () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const resetButton = screen.getByRole("button", { name: /reset count/i });
    const user = userEvent.setup();

    await user.click(clickButton);

    expect(document.activeElement).toBe(clickButton);
    expect(document.querySelector("#count-display")?.textContent).toBe("perfect kth powers: 3");
    expect(document.querySelector("#status-display")?.textContent).toBe("Calculated for [1, 10] with k = 2");
    expect(resetButton.hasAttribute("disabled")).toBe(false);
    expect(document.querySelector("#milestone-message")?.hasAttribute("hidden")).toBe(false);
  });

  it("counts odd perfect powers across a negative to positive range", async () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const leftInput = document.querySelector("#l-input") as HTMLInputElement;
    const rightInput = document.querySelector("#r-input") as HTMLInputElement;
    const kthInput = document.querySelector("#k-input") as HTMLInputElement;
    const user = userEvent.setup();

    await user.clear(leftInput);
    await user.type(leftInput, "-8");
    await user.clear(rightInput);
    await user.type(rightInput, "8");
    await user.clear(kthInput);
    await user.type(kthInput, "3");
    await user.click(clickButton);

    expect(document.querySelector("#count-display")?.textContent).toBe("perfect kth powers: 5");
    expect(document.querySelector("#status-display")?.textContent).toBe("Calculated for [-8, 8] with k = 3");
    expect(document.querySelector("#milestone-message")?.textContent).toBe("Calculation complete");
    expect(document.querySelector("#milestone-message")?.hasAttribute("hidden")).toBe(false);
    expect(clickButton.hasAttribute("disabled")).toBe(false);
  });

  it.each([
    { left: "1", right: "9", kth: "3", expected: "2" },
    { left: "8", right: "30", kth: "2", expected: "3" },
    { left: "9", right: "16", kth: "2", expected: "2" },
    { left: "-30", right: "30", kth: "3", expected: "7" },
    { left: "-30", right: "30", kth: "2", expected: "6" },
    { left: "-30", right: "-1", kth: "2", expected: "0" },
    { left: "-30", right: "0", kth: "2", expected: "1" },
    { left: "1", right: "25", kth: "1", expected: "25" },
  ])(
    "calculates perfect kth powers for l=$left, r=$right, k=$kth",
    async ({ left, right, kth, expected }) => {
      const clickButton = screen.getByRole("button", { name: /click me/i });
      const leftInput = document.querySelector("#l-input") as HTMLInputElement;
      const rightInput = document.querySelector("#r-input") as HTMLInputElement;
      const kthInput = document.querySelector("#k-input") as HTMLInputElement;
      const user = userEvent.setup();

      await user.clear(leftInput);
      await user.type(leftInput, left);
      await user.clear(rightInput);
      await user.type(rightInput, right);
      await user.clear(kthInput);
      await user.type(kthInput, kth);
      await user.click(clickButton);

      expect(document.querySelector("#count-display")?.textContent).toBe(`perfect kth powers: ${expected}`);
      expect(document.querySelector("#status-display")?.textContent).toBe(
        `Calculated for [${left}, ${right}] with k = ${kth}`,
      );
      expect(document.querySelector("#milestone-message")?.hasAttribute("hidden")).toBe(false);
    },
  );

  it("resets back to the initial state", async () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const resetButton = screen.getByRole("button", { name: /reset count/i });
    const leftInput = document.querySelector("#l-input") as HTMLInputElement;
    const user = userEvent.setup();

    await user.clear(leftInput);
    await user.type(leftInput, "16");
    await user.click(clickButton);
    await user.click(resetButton);

    expect((document.querySelector("#l-input") as HTMLInputElement | null)?.value).toBe("1");
    expect((document.querySelector("#r-input") as HTMLInputElement | null)?.value).toBe("10");
    expect((document.querySelector("#k-input") as HTMLInputElement | null)?.value).toBe("2");
    expect(document.querySelector("#count-display")?.textContent).toBe("perfect kth powers: 0");
    expect(document.querySelector("#status-display")?.textContent).toBe("Enter integer l, r, and k, then click the button");
    expect(document.querySelector("#milestone-message")?.hasAttribute("hidden")).toBe(true);
    expect(clickButton.hasAttribute("disabled")).toBe(false);
    expect(resetButton.hasAttribute("disabled")).toBe(true);
  });

  it("shows a validation error for invalid ranges", async () => {
    const clickButton = screen.getByRole("button", { name: /click me/i });
    const leftInput = document.querySelector("#l-input") as HTMLInputElement;
    const rightInput = document.querySelector("#r-input") as HTMLInputElement;
    const user = userEvent.setup();

    await user.clear(leftInput);
    await user.type(leftInput, "9");
    await user.clear(rightInput);
    await user.type(rightInput, "1");
    await user.click(clickButton);

    expect(document.querySelector("#count-display")?.textContent).toBe("perfect kth powers: 0");
    expect(document.querySelector("#status-display")?.textContent).toBe("l must be less than or equal to r.");
    expect(document.querySelector("#milestone-message")?.hasAttribute("hidden")).toBe(true);
    expect(screen.getByRole("button", { name: /reset count/i }).hasAttribute("disabled")).toBe(false);
  });
});

import { test, expect } from "@playwright/test";

test("root URL shows the required heading and title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /hello, ui task/i })).toBeVisible();
  await expect(page).toHaveTitle("UI task");
});

test("page shows the initial control state", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /click me/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /reset count/i })).toBeDisabled();
  await expect(page.locator("#reset-button")).toBeVisible();
  await expect(page.locator("#count-display")).toHaveText("click count: 0");
  await expect(page.locator("#status-display")).toHaveText("Ready to be clicked");
  await expect(page.locator("#milestone-message")).toHaveText("Milestone reached");
  await expect(page.locator("#milestone-message")).toBeHidden();
});

test("clicking once updates the counter, status, and focus", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  await button.click();
  await expect(page.locator("#count-display")).toHaveText("click count: 1");
  await expect(page.locator("#status-display")).toHaveText("clicked once");
  await expect(page.getByRole("button", { name: /reset count/i })).toBeEnabled();
  await expect(button).toBeFocused();
});

test("shows the milestone message after five clicks", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });

  for (let index = 0; index < 3; index += 1) {
    await button.click();
  }

  await expect(page.locator("#count-display")).toHaveText("click count: 3");
  await expect(page.locator("#status-display")).toHaveText("clicked 3 times");

  for (let index = 3; index < 5; index += 1) {
    await button.click();
  }

  await expect(page.locator("#count-display")).toHaveText("click count: 5");
  await expect(page.locator("#status-display")).toHaveText("clicked 5 times");
  await expect(page.locator("#milestone-message")).toHaveText("Milestone reached");
  await expect(page.locator("#milestone-message")).toBeVisible();
});

test("disables the click button at ten clicks", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });

  for (let index = 0; index < 10; index += 1) {
    await button.click();
  }

  await expect(page.locator("#count-display")).toHaveText("click count: 10");
  await expect(page.locator("#status-display")).toHaveText("limit reached");
  await expect(button).toBeDisabled();
});

test("reset restores the initial state", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  const resetButton = page.getByRole("button", { name: /reset count/i });

  await button.click();
  await button.click();
  await resetButton.click();

  await expect(page.locator("#count-display")).toHaveText("click count: 0");
  await expect(page.locator("#status-display")).toHaveText("Ready to be clicked");
  await expect(page.locator("#milestone-message")).toBeHidden();
  await expect(button).toBeEnabled();
  await expect(resetButton).toBeDisabled();
});

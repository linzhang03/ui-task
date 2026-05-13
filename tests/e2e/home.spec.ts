import { test, expect } from "@playwright/test";

test("root URL shows the required heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /hello, ui task/i })).toBeVisible();
});

test("page title is UI task", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("UI task");
});

test("page shows a Click me button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /click me/i })).toBeVisible();
});

test("button receives focus when clicked", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  await button.click();
  await expect(button).toBeFocused();
});

test("shows click count: 0 initially", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#count-display")).toHaveText("click count: 0");
});

test("increments click count on each button click", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  await button.click();
  await expect(page.locator("#count-display")).toHaveText("click count: 1");
  await button.click();
  await expect(page.locator("#count-display")).toHaveText("click count: 2");
});

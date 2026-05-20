import { test, expect } from "@playwright/test";

test("root URL shows the required heading and title", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /hello, ui task/i })).toBeVisible();
  await expect(page).toHaveTitle("UI task");
});

test("page shows the initial calculator state", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /click me/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /reset count/i })).toBeDisabled();
  await expect(page.locator("#reset-button")).toBeVisible();
  await expect(page.locator("#l-input")).toHaveValue("1");
  await expect(page.locator("#r-input")).toHaveValue("10");
  await expect(page.locator("#k-input")).toHaveValue("2");
  await expect(page.locator("#count-display")).toHaveText("perfect kth powers: 0");
  await expect(page.locator("#status-display")).toHaveText("Enter integer l, r, and k, then click the button");
  await expect(page.locator("#milestone-message")).toHaveText("Calculation complete");
  await expect(page.locator("#milestone-message")).toBeHidden();
});

test("clicking once calculates the result for the default inputs", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  await button.click();
  await expect(page.locator("#count-display")).toHaveText("perfect kth powers: 3");
  await expect(page.locator("#status-display")).toHaveText("Calculated for [1, 10] with k = 2");
  await expect(page.getByRole("button", { name: /reset count/i })).toBeEnabled();
  await expect(button).toBeFocused();
  await expect(page.locator("#milestone-message")).toBeVisible();
});

test("calculates odd perfect powers across a negative range", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  await page.locator("#l-input").fill("-8");
  await page.locator("#r-input").fill("8");
  await page.locator("#k-input").fill("3");
  await button.click();

  await expect(page.locator("#count-display")).toHaveText("perfect kth powers: 5");
  await expect(page.locator("#status-display")).toHaveText("Calculated for [-8, 8] with k = 3");
  await expect(page.locator("#milestone-message")).toHaveText("Calculation complete");
  await expect(page.locator("#milestone-message")).toBeVisible();
});

const requestedCases = [
  { left: "1", right: "9", kth: "3", expected: "2" },
  { left: "8", right: "30", kth: "2", expected: "3" },
  { left: "9", right: "16", kth: "2", expected: "2" },
  { left: "-30", right: "30", kth: "3", expected: "7" },
  { left: "-30", right: "30", kth: "2", expected: "6" },
  { left: "-30", right: "-1", kth: "2", expected: "0" },
  { left: "-30", right: "0", kth: "2", expected: "1" },
  { left: "1", right: "25", kth: "1", expected: "25" },
];

for (const testCase of requestedCases) {
  test(`calculates l=${testCase.left}, r=${testCase.right}, k=${testCase.kth}`, async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: /click me/i });

    await page.locator("#l-input").fill(testCase.left);
    await page.locator("#r-input").fill(testCase.right);
    await page.locator("#k-input").fill(testCase.kth);
    await button.click();

    await expect(page.locator("#count-display")).toHaveText(`perfect kth powers: ${testCase.expected}`);
    await expect(page.locator("#status-display")).toHaveText(
      `Calculated for [${testCase.left}, ${testCase.right}] with k = ${testCase.kth}`,
    );
    await expect(page.locator("#milestone-message")).toBeVisible();
  });
}

test("shows a validation error when l is greater than r", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  await page.locator("#l-input").fill("9");
  await page.locator("#r-input").fill("1");
  await button.click();

  await expect(page.locator("#count-display")).toHaveText("perfect kth powers: 0");
  await expect(page.locator("#status-display")).toHaveText("l must be less than or equal to r.");
  await expect(button).toBeEnabled();
  await expect(page.locator("#milestone-message")).toBeHidden();
});

test("reset restores the initial state", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: /click me/i });
  const resetButton = page.getByRole("button", { name: /reset count/i });

  await page.locator("#l-input").fill("16");
  await button.click();
  await resetButton.click();

  await expect(page.locator("#l-input")).toHaveValue("1");
  await expect(page.locator("#r-input")).toHaveValue("10");
  await expect(page.locator("#k-input")).toHaveValue("2");
  await expect(page.locator("#count-display")).toHaveText("perfect kth powers: 0");
  await expect(page.locator("#status-display")).toHaveText("Enter integer l, r, and k, then click the button");
  await expect(page.locator("#milestone-message")).toBeHidden();
  await expect(button).toBeEnabled();
  await expect(resetButton).toBeDisabled();
});

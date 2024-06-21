import { test, expect } from "@playwright/test";

test.describe("Login functionality", () => {
  test("Login failed with incorrect credentials", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.fill('input[id="email"]', "wrongemail@example.com");

    await page.fill('input[id="password"]', "wrongpassword");

    await page.click('button[type="submit"]');

    await expect(
      page.locator("text=Error! Incorrect email or password. Please try again.")
    ).toBeVisible();
  });
});

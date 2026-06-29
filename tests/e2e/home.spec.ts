import { expect, test } from "@playwright/test";

test("mobile shopping view renders and toggles an item", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
  await page.getByLabel("メールアドレス").fill("owner@example.local");
  await page.getByLabel("パスワード").fill("change-me");
  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page.getByRole("heading", { name: "今日買う" })).toBeVisible();
  await expect(page.getByText("牛乳")).toBeVisible();

  await page.getByRole("button", { name: "牛乳を購入済みにする" }).click();
  await expect(
    page.getByRole("button", { name: "牛乳を未購入に戻す" })
  ).toBeVisible();
});

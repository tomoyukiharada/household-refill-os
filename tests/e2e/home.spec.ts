import { expect, test } from "@playwright/test";

test("phase 2 data changes persist after reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
  await page.getByLabel("メールアドレス").fill("owner@example.local");
  await page.getByLabel("パスワード").fill("change-me");
  await page.getByRole("button", { name: "ログイン" }).click();

  await expect(page.getByRole("heading", { name: "今日買う" })).toBeVisible();
  await expect(page.getByText("牛乳")).toBeVisible();

  const milkToggle = page.getByRole("button", {
    name: /牛乳を(購入済みにする|未購入に戻す)/
  });
  const beforeToggle = await milkToggle.getAttribute("aria-label");
  const afterToggle =
    beforeToggle === "牛乳を購入済みにする"
      ? "牛乳を未購入に戻す"
      : "牛乳を購入済みにする";
  await milkToggle.click();
  await expect(page.getByRole("button", { name: afterToggle })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: afterToggle })).toBeVisible();

  const itemName = `E2E追加品-${Date.now()}`;
  await page.getByText("買うものを追加").click();
  await page.getByLabel("商品名").fill(itemName);
  await page.getByLabel("メモ").fill("再読込後も保存されること");
  await page.getByRole("button", { name: "リストに保存" }).click();
  await expect(page.getByText(itemName)).toBeVisible();
  await page.reload();
  await expect(page.getByText(itemName)).toBeVisible();

  await page.goto("/inventory");
  const detergent = page.getByRole("article").filter({ hasText: "洗濯洗剤" });
  await detergent.getByLabel("洗濯洗剤の残量").selectOption("empty");
  await detergent.getByRole("button", { name: "保存" }).click();
  await page.reload();
  await expect(
    page.getByLabel("洗濯洗剤の残量")
  ).toHaveValue("empty");
});

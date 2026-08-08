import { expect, test, type Page } from "@playwright/test"

import { expectNoAxeViolations } from "./axe.js"

async function resetFixture(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("consumer-sidebar-e2e")
  })
  await page.goto("/")
}

test("packed consumer has no WCAG A/AA violations", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Chromium owns deterministic browser accessibility scanning"
  )

  await resetFixture(page)
  await expect(
    page.getByRole("heading", { name: "Vite React 19 consumer" })
  ).toBeVisible()
  await expectNoAxeViolations(page)
})

test("open dialog has no WCAG A/AA violations", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Chromium owns deterministic browser accessibility scanning"
  )

  await resetFixture(page)
  await page.getByRole("button", { name: "Open dialog" }).click()
  await expect(
    page.getByRole("dialog", { name: "Consumer dialog" })
  ).toBeVisible()
  await expectNoAxeViolations(page)
})

test("mobile navigation has no WCAG A/AA violations", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Chromium owns deterministic browser accessibility scanning"
  )

  await page.setViewportSize({ width: 390, height: 844 })
  await resetFixture(page)
  await page.getByRole("button", { name: "Toggle consumer navigation" }).click()
  await expect(
    page.getByRole("dialog", { name: "Consumer navigation" })
  ).toBeVisible()
  await expectNoAxeViolations(page)
})

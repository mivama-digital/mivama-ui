import { expect, test, type Page } from "@playwright/test"

async function resetFixture(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("consumer-sidebar-e2e")
  })
  await page.goto("/")
  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

const screenshotOptions = {
  animations: "disabled" as const,
  caret: "hide" as const,
  fullPage: true,
  maxDiffPixelRatio: 0.005,
}

test("dialog open and focused", async ({ page, browserName }) => {
  test.skip(
    browserName !== "chromium",
    "Chromium/Linux owns deterministic visual baselines"
  )

  await page.setViewportSize({ width: 1440, height: 1000 })
  await resetFixture(page)
  await page.getByRole("button", { name: "Open dialog" }).click()
  await page.getByRole("textbox", { name: "Dialog email" }).focus()
  await expect(
    page.getByRole("textbox", { name: "Dialog email" })
  ).toBeFocused()
  await expect(page).toHaveScreenshot(
    "dialog-open-focused.png",
    screenshotOptions
  )
})

test("collapsed sidebar with keyboard focus", async ({ page, browserName }) => {
  test.skip(
    browserName !== "chromium",
    "Chromium/Linux owns deterministic visual baselines"
  )

  await page.setViewportSize({ width: 1440, height: 1000 })
  await resetFixture(page)
  const trigger = page.locator('[data-slot="sidebar-trigger"]')
  await trigger.click()
  await trigger.focus()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(trigger).toBeFocused()
  await expect(page).toHaveScreenshot(
    "sidebar-collapsed-focused.png",
    screenshotOptions
  )
})

test("mobile sidebar open", async ({ page, browserName }) => {
  test.skip(
    browserName !== "chromium",
    "Chromium/Linux owns deterministic visual baselines"
  )

  await page.setViewportSize({ width: 390, height: 844 })
  await resetFixture(page)
  await page.getByRole("button", { name: "Toggle consumer navigation" }).click()
  await expect(
    page.getByRole("dialog", { name: "Consumer navigation" })
  ).toBeVisible()
  await expect(page).toHaveScreenshot(
    "sidebar-mobile-open.png",
    screenshotOptions
  )
})

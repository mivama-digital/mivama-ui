import { expect, test, type Locator, type Page } from "@playwright/test"

function collectBrowserErrors(page: Page) {
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))

  return errors
}

async function expectControlledSidebar(trigger: Locator, page: Page) {
  const controls = await trigger.getAttribute("aria-controls")
  expect(controls).toBeTruthy()
  await expect(page.locator(`[id="${controls}"]`)).toHaveCount(1)
}

test("desktop sidebar toggles, persists, and ignores shortcuts while editing", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page)
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/")

  const trigger = page.locator('[data-slot="sidebar-trigger"]')
  const sidebar = page.locator('[data-slot="sidebar"][data-state]')

  await expect(trigger).toHaveAccessibleName("Toggle consumer navigation")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(sidebar).toHaveAttribute("data-state", "expanded")
  await expectControlledSidebar(trigger, page)

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(sidebar).toHaveAttribute("data-state", "collapsed")
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("consumer-sidebar-e2e"))
    )
    .toBe("false")

  await page.reload()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(sidebar).toHaveAttribute("data-state", "collapsed")

  await page.keyboard.press("Control+b")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(sidebar).toHaveAttribute("data-state", "expanded")
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("consumer-sidebar-e2e"))
    )
    .toBe("true")

  const email = page.getByLabel("Email")
  await email.focus()
  await page.keyboard.press("Control+b")
  await expect(trigger).toHaveAttribute("aria-expanded", "true")
  await expect(sidebar).toHaveAttribute("data-state", "expanded")

  expect(browserErrors).toEqual([])
})

test("mobile sidebar exposes the controlled sheet and restores focus", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  const trigger = page.locator('[data-slot="sidebar-trigger"]')
  await expect(trigger).toHaveAccessibleName("Toggle consumer navigation")
  await expect(trigger).toHaveAttribute("aria-expanded", "false")

  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "true")

  const dialog = page.getByRole("dialog", { name: "Consumer navigation" })
  await expect(dialog).toBeVisible()
  await expect(dialog).toHaveAttribute("data-slot", "sidebar")
  await expect(dialog).toHaveAttribute("data-mobile", "true")
  await expectControlledSidebar(trigger, page)

  expect(
    await page.evaluate(() => localStorage.getItem("consumer-sidebar-e2e"))
  ).toBeNull()

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await expect(trigger).toBeFocused()

  expect(browserErrors).toEqual([])
})

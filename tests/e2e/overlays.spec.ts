import { expect, test, type Locator, type Page } from "@playwright/test"

function collectBrowserErrors(page: Page) {
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))

  return errors
}

function containsActiveElement(locator: Locator) {
  return locator.evaluate((node) => node.contains(document.activeElement))
}

test("dialog traps focus and restores its trigger", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page)
  await page.goto("/")

  const trigger = page.getByRole("button", { name: "Open dialog" })
  await trigger.click()

  const dialog = page.getByRole("dialog", { name: "Consumer dialog" })
  const email = page.getByRole("textbox", { name: "Dialog email" })
  const close = dialog.getByRole("button", { name: "Close" })

  await expect(dialog).toBeVisible()
  await expect.poll(() => containsActiveElement(dialog)).toBe(true)

  await email.focus()
  await page.keyboard.press("Tab")
  await expect(close).toBeFocused()

  await page.keyboard.press("Tab")
  await expect(email).toBeFocused()

  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(browserErrors).toEqual([])
})

test("sheet keeps modal focus on mobile", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")

  const trigger = page.getByRole("button", { name: "Open sheet" })
  await trigger.click()

  const sheet = page.getByRole("dialog", { name: "Consumer sheet" })
  await expect(sheet).toBeVisible()
  await expect(sheet).toHaveAttribute("data-side", "right")
  await expect(sheet).toHaveAttribute("data-size", "sm")
  await expect.poll(() => containsActiveElement(sheet)).toBe(true)

  await page.keyboard.press("Tab")
  expect(await containsActiveElement(sheet)).toBe(true)

  await page.keyboard.press("Escape")
  await expect(sheet).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(browserErrors).toEqual([])
})

test("tooltip links its description and dismisses with Escape", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page)
  await page.goto("/")

  const trigger = page.getByRole("button", { name: "Tooltip target" })
  await trigger.focus()

  const tooltip = page.getByRole("tooltip", { name: "Consumer tooltip" })
  await expect(tooltip).toBeVisible()

  const tooltipId = await tooltip.getAttribute("id")
  expect(tooltipId).toBeTruthy()
  await expect(trigger).toHaveAttribute(
    "aria-describedby",
    new RegExp(`(^|\\s)${tooltipId}(\\s|$)`)
  )

  await page.keyboard.press("Escape")
  await expect(tooltip).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(browserErrors).toEqual([])
})

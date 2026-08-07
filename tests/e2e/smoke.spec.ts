import { expect, test } from "@playwright/test"

test("packed UI testbed supports core browser interactions", async ({
  page,
}) => {
  const browserErrors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text())
  })
  page.on("pageerror", (error) => browserErrors.push(error.message))

  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: "Vite React 19 consumer" })
  ).toBeVisible()

  const email = page.getByLabel("Email")
  await email.focus()
  await expect(email).toBeFocused()

  await page.getByRole("tab", { name: "Details" }).click()
  await expect(page.getByText("Tailwind package styles compile.")).toBeVisible()

  await page.getByRole("button", { name: "Open dialog" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByText("Consumer dialog")).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()

  expect(browserErrors).toEqual([])
})

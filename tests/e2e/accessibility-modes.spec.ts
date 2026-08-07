import { expect, test, type Page } from "@playwright/test"

function collectBrowserErrors(page: Page) {
  const errors: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  page.on("pageerror", (error) => errors.push(error.message))

  return errors
}

test("reduced motion disables scroll-scene animation and long transitions", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page)
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1024, height: 800 })
  await page.goto("/")

  const state = await page.evaluate(() => {
    const scene = document.createElement("div")
    scene.className = "mivama-scroll-scene"
    const layer = document.createElement("div")
    layer.className = "mivama-scroll-layer"
    layer.dataset.effect = "reveal"
    scene.append(layer)
    document.body.append(scene)

    const trigger = document.querySelector<HTMLElement>(
      '[data-slot="sidebar-trigger"]'
    )
    if (!trigger) throw new Error("Sidebar trigger is missing")

    const durationToMilliseconds = (value: string) => {
      const parsed = Number.parseFloat(value)
      return value.trim().endsWith("ms") ? parsed : parsed * 1000
    }

    const transitionDurations = getComputedStyle(trigger)
      .transitionDuration.split(",")
      .map(durationToMilliseconds)

    return {
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      animationName: getComputedStyle(layer).animationName,
      maxTransitionDuration: Math.max(...transitionDurations),
    }
  })

  expect(state.reducedMotion).toBe(true)
  expect(state.animationName).toBe("none")
  expect(state.maxTransitionDuration).toBeLessThanOrEqual(0.02)
  expect(browserErrors).toEqual([])
})

test("increased contrast promotes semantic borders to foreground contrast", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page)
  await page.emulateMedia({ contrast: "more" })
  await page.goto("/")

  const state = await page.locator("[data-mivama-theme]").evaluate((shell) => {
    const probe = document.createElement("div")
    probe.style.border = "1px solid var(--border-strong)"
    probe.style.color = "var(--foreground)"
    shell.append(probe)

    const style = getComputedStyle(probe)
    return {
      increasedContrast: matchMedia("(prefers-contrast: more)").matches,
      borderColor: style.borderTopColor,
      foregroundColor: style.color,
    }
  })

  expect(state.increasedContrast).toBe(true)
  expect(state.borderColor).toBe(state.foregroundColor)
  expect(browserErrors).toEqual([])
})

test("forced colors keeps a visible keyboard focus outline", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Chromium owns forced-colors rendering coverage"
  )

  const browserErrors = collectBrowserErrors(page)
  await page.emulateMedia({ forcedColors: "active" })
  await page.goto("/")

  const trigger = page.locator('[data-slot="sidebar-trigger"]')
  await trigger.focus()
  await expect(trigger).toBeFocused()

  const state = await trigger.evaluate((node) => {
    const style = getComputedStyle(node)
    return {
      forcedColors: matchMedia("(forced-colors: active)").matches,
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    }
  })

  expect(state.forcedColors).toBe(true)
  expect(state.outlineStyle).toBe("solid")
  expect(state.outlineWidth).toBeGreaterThanOrEqual(2)
  expect(browserErrors).toEqual([])
})

test("RTL inherits through mobile navigation without horizontal overflow", async ({
  page,
}) => {
  const browserErrors = collectBrowserErrors(page)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  await page.locator("html").evaluate((node) => {
    node.setAttribute("dir", "rtl")
  })

  await expect(page.locator("html")).toHaveAttribute("dir", "rtl")
  expect(
    await page
      .locator("html")
      .evaluate((node) => getComputedStyle(node).direction)
  ).toBe("rtl")

  const trigger = page.locator('[data-slot="sidebar-trigger"]')
  await trigger.click()
  const navigation = page.getByRole("dialog", { name: "Consumer navigation" })
  await expect(navigation).toBeVisible()
  expect(
    await navigation.evaluate((node) => getComputedStyle(node).direction)
  ).toBe("rtl")

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    )
  ).toBe(true)

  await page.keyboard.press("Escape")
  await expect(navigation).toBeHidden()
  await expect(trigger).toBeFocused()
  expect(browserErrors).toEqual([])
})

import { expect, test, type Page } from "@playwright/test"

const themes = ["product", "editorial", "portal"] as const
const modes = ["light", "dark"] as const
const densities = ["comfortable", "compact"] as const
const viewports = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 1000 },
} as const

type VisualState = {
  theme: (typeof themes)[number]
  mode: (typeof modes)[number]
  density: (typeof densities)[number]
}

async function applyVisualState(page: Page, state: VisualState) {
  const shell = page.locator("[data-mivama-theme]")
  await shell.evaluate((node, nextState) => {
    node.setAttribute("data-mivama-theme", nextState.theme)
    node.setAttribute("data-density", nextState.density)
    node.classList.toggle("dark", nextState.mode === "dark")
  }, state)

  await page.evaluate(async () => {
    await document.fonts.ready
  })
}

for (const [viewportName, viewport] of Object.entries(viewports)) {
  for (const theme of themes) {
    for (const mode of modes) {
      for (const density of densities) {
        test(`${theme} ${mode} ${density} ${viewportName}`, async ({
          page,
          browserName,
        }) => {
          test.skip(
            browserName !== "chromium",
            "Chromium/Linux owns deterministic visual baselines"
          )

          await page.setViewportSize(viewport)
          await page.addInitScript(() => {
            localStorage.removeItem("consumer-sidebar-e2e")
          })
          await page.goto("/")
          await applyVisualState(page, { theme, mode, density })

          await expect(page).toHaveScreenshot(
            `${theme}-${mode}-${density}-${viewportName}.png`,
            {
              animations: "disabled",
              caret: "hide",
              fullPage: true,
              maxDiffPixelRatio: 0.005,
            }
          )
        })
      }
    }
  }
}

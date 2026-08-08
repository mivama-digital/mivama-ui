import { expect, type Page } from "@playwright/test"
import axe from "axe-core"

type AxeViolationSummary = {
  id: string
  impact: string | null
  help: string
  targets: string[][]
}

type AxeViolation = Omit<AxeViolationSummary, "targets"> & {
  nodes: Array<{ target: string[] }>
}

const wcagTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

export async function expectNoAxeViolations(page: Page) {
  await page.addScriptTag({ content: axe.source })

  const violations = await page.evaluate(async (tags) => {
    const runtime = (
      window as typeof window & {
        axe: {
          run: (
            context: Document,
            options: {
              runOnly: { type: "tag"; values: string[] }
              resultTypes: ["violations"]
            }
          ) => Promise<{ violations: AxeViolation[] }>
        }
      }
    ).axe

    const result = await runtime.run(document, {
      runOnly: { type: "tag", values: tags },
      resultTypes: ["violations"],
    })

    return result.violations.map(({ id, impact, help, nodes }) => ({
      id,
      impact,
      help,
      targets: nodes.map((node) => node.target),
    }))
  }, wcagTags)

  expect(
    violations,
    `Browser accessibility violations:\n${JSON.stringify(violations, null, 2)}`
  ).toEqual([])
}

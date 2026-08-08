import { TypographyExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Typography/Typography",
  "Semantic heading and text styles driven by design-system tokens.",
  "padded"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <TypographyExample />,
}

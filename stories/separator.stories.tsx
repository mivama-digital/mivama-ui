import { SeparatorExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Layout/Separator",
  "Visual and semantic content separator.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <SeparatorExample />,
}

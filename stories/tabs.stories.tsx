import { TabsExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Navigation/Tabs",
  "Tabs with arrow-key navigation and associated panels.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <TabsExample />,
}

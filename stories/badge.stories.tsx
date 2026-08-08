import { BadgeExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Feedback/Badge",
  "Compact status label.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <BadgeExample />,
}

import { EmptyExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Feedback/Empty",
  "Empty-state composition for missing or first-run content.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <EmptyExample />,
}

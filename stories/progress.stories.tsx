import { ProgressExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Feedback/Progress",
  "Progress status with label, value, track, and indicator semantics.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <ProgressExample />,
}

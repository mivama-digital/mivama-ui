import { AlertExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Feedback/Alert",
  "Status messaging with a title and supporting description.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <AlertExample />,
}

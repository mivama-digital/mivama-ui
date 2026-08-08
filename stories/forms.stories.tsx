import { FormsExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Form/Forms",
  "Canonical aggregate entry point for form primitives.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <FormsExample />,
}

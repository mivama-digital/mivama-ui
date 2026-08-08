import { SelectExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Form/Select",
  "Native select control with browser keyboard semantics.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <SelectExample />,
}

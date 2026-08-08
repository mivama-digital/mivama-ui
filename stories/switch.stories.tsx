import { SwitchExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Form/Switch",
  "Binary switch with keyboard and focus semantics from Base UI.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <SwitchExample />,
}

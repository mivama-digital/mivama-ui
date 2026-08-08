import { FieldExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Form/Field",
  "Form-field composition connecting label, control, and description.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <FieldExample />,
}

import { InputExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Form/Input",
  "Native text input with design-system focus and invalid states.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <InputExample />,
}

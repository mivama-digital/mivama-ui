import { TextareaExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Form/Textarea",
  "Native multi-line text input.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <TextareaExample />,
}

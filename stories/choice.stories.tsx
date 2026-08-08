import { ChoiceExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Form/Choice",
  "Native checkbox/radio inputs with visible labels and keyboard behavior.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <ChoiceExample />,
}

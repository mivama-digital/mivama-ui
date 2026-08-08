import { ButtonExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Action/Button",
  "Primary action primitive. Native button keyboard activation and focus semantics are preserved.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <ButtonExample />,
}

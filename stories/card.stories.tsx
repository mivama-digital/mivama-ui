import { CardExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Layout/Card",
  "Surface for grouped content and actions.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <CardExample />,
}

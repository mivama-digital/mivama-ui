import { SectionExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Layout/Section",
  "Vertical rhythm and surface section primitive.",
  "padded"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <SectionExample />,
}

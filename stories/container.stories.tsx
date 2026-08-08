import { ContainerExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Layout/Container",
  "Responsive content-width and page-gutter primitive.",
  "padded"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <ContainerExample />,
}

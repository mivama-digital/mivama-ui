import { EditorialGridExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Layout/EditorialGrid",
  "Editorial layout grid for content-led surfaces.",
  "padded"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <EditorialGridExample />,
}

import { PaginationExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Navigation/Pagination",
  "Pagination uses native links and exposes the current page semantically.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <PaginationExample />,
}

import { BreadcrumbExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Navigation/Breadcrumb",
  "Hierarchical navigation using native links and a current-page item.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <BreadcrumbExample />,
}

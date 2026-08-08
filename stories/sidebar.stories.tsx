import { SidebarCollapsibleExample, SidebarExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Navigation/Sidebar",
  "Responsive navigation shell with keyboard shortcut, persistence, mobile Sheet behavior, and focus restoration.",
  "fullscreen"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <SidebarExample />,
}

export const Collapsible: MivamaStory = {
  render: () => <SidebarCollapsibleExample />,
}

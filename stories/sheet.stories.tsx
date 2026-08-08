import { SheetExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Overlay/Sheet",
  "Modal sheet with Escape dismissal, focus management, and focus restoration.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <SheetExample />,
}

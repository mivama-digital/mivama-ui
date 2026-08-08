import { TooltipExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Overlay/Tooltip",
  "Tooltip content is associated with a keyboard-focusable trigger.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <TooltipExample />,
}

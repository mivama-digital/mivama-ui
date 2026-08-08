import { BentoGridExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Layout/BentoGrid",
  "Responsive editorial card grid.",
  "padded"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <BentoGridExample />,
}

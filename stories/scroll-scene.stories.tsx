import { ScrollSceneExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Layout/ScrollScene",
  "Progressively enhanced scroll-motion composition with reduced-motion support.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <ScrollSceneExample />,
}

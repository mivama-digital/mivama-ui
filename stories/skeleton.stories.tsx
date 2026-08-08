import { SkeletonExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Feedback/Skeleton",
  "Deterministic loading placeholder.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <SkeletonExample />,
}

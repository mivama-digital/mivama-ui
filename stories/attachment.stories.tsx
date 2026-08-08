import { AttachmentExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Feedback/Attachment",
  "File metadata surface. The trigger remains keyboard reachable and needs an accessible name.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <AttachmentExample />,
}

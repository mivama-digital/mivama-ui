import { MessageExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Feedback/Message",
  "Conversation/message layout primitive.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <MessageExample />,
}

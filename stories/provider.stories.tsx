import { MivamaProviderExample } from "./_examples.js"
import { defineMivamaMeta, type MivamaStory } from "./_support.js"

const meta = defineMivamaMeta(
  "Provider/MivamaProvider",
  "Provider shell for theme, density, and portal context.",
  "centered"
)

export default meta

export const Basic: MivamaStory = {
  render: () => <MivamaProviderExample />,
}

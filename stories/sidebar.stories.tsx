import { SidebarCollapsibleExample, SidebarExample } from "./_examples.js"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Navigation/Sidebar",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Responsive navigation shell with keyboard shortcut, persistence, mobile Sheet behavior, and focus restoration.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <SidebarExample />,
}

export const Collapsible: Story = {
  render: () => <SidebarCollapsibleExample />,
}

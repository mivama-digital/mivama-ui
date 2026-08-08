import { FieldExample } from "./_examples.js"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Form/Field",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Form-field composition connecting label, control, and description.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <FieldExample />,
}

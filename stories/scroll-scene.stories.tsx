import { Heading, ScrollLayer, ScrollScene, Text } from "../src/index.js"
import { ScrollSceneExample } from "./_examples.js"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta = {
  title: "Layout/ScrollScene",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Progressively enhanced scroll-motion composition with independent per-layer view timelines and reduced-motion/static fallbacks.",
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => <ScrollSceneExample />,
}

export const IndependentScenes: Story = {
  render: () => (
    <div className="grid w-[36rem] max-w-full gap-6">
      {["Primary scene", "Independent scene"].map((title, index) => (
        <ScrollScene key={title} className="rounded-xl border bg-card p-6">
          <ScrollLayer effect="reveal" distance={index === 0 ? 24 : 16}>
            <Heading variant="title">{title}</Heading>
            <Text>
              Each layer resolves progress from its own viewport visibility.
            </Text>
          </ScrollLayer>
          <ScrollLayer
            effect="parallax"
            direction="down"
            distance={8}
            className="mt-4"
          >
            <Text variant="small">Bounded supporting motion</Text>
          </ScrollLayer>
        </ScrollScene>
      ))}
    </div>
  ),
}

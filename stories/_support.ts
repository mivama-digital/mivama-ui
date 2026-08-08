import type { Meta, StoryObj } from "@storybook/react-vite"

export type MivamaStory = StoryObj

export function defineMivamaMeta(
  title: string,
  description: string,
  layout: "centered" | "padded" | "fullscreen" = "centered"
): Meta {
  return {
    title,
    tags: ["autodocs"],
    parameters: {
      layout,
      docs: {
        description: {
          component: description,
        },
      },
    },
  }
}

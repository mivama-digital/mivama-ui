import type { Decorator, Preview } from "@storybook/react-vite"

import { MivamaProvider } from "../src/components/mivama-provider.js"
import "../src/styles.css"

const withMivamaShell: Decorator = (Story, context) => {
  const theme = String(context.globals.theme ?? "product")
  const density = String(context.globals.density ?? "comfortable")
  const mode = String(context.globals.mode ?? "light")
  const direction = String(context.globals.direction ?? "ltr") as "ltr" | "rtl"

  return (
    <div
      className={mode === "dark" ? "dark min-h-screen" : "min-h-screen"}
      dir={direction}
    >
      <MivamaProvider
        theme={theme}
        density={density}
        className="min-h-screen bg-background p-6 text-foreground"
      >
        <Story />
      </MivamaProvider>
    </div>
  )
}

const preview: Preview = {
  decorators: [withMivamaShell],
  globalTypes: {
    theme: {
      description: "Mivama theme",
      toolbar: {
        items: ["product", "editorial", "portal"],
        dynamicTitle: true,
      },
    },
    mode: {
      description: "Color mode",
      toolbar: {
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
    density: {
      description: "Control density",
      toolbar: {
        items: ["comfortable", "compact"],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Writing direction",
      toolbar: {
        items: ["ltr", "rtl"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "product",
    mode: "light",
    density: "comfortable",
    direction: "ltr",
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview

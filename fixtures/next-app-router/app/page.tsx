import { BentoGrid, BentoGridItem } from "@mivama/ui/bento-grid"
import { EditorialGrid } from "@mivama/ui/editorial-grid"
import { ScrollLayer, ScrollScene } from "@mivama/ui/scroll-scene"

import { ClientShowcase } from "../components/client-showcase"

export default function Page() {
  return (
    <main className="mx-auto grid min-h-screen max-w-5xl gap-10 p-8">
      <header className="grid gap-3">
        <p className="text-sm text-muted-foreground">Server Component</p>
        <h1 className="text-3xl font-semibold">Next App Router consumer</h1>
        <p>
          This route imports server-compatible Mivama UI subpaths without a
          client directive.
        </p>
      </header>

      <EditorialGrid>
        <div className="col-span-full rounded-xl border border-border p-6">
          EditorialGrid renders directly in the server component tree.
        </div>
      </EditorialGrid>

      <BentoGrid>
        <BentoGridItem span={2} className="rounded-xl border border-border p-6">
          BentoGrid and BentoGridItem remain server-compatible.
        </BentoGridItem>
        <BentoGridItem className="rounded-xl border border-border p-6">
          Public subpath imports resolve from the packed distribution.
        </BentoGridItem>
      </BentoGrid>

      <ScrollScene>
        <ScrollLayer className="rounded-xl border border-border p-6">
          ScrollScene renders without browser APIs during the server build.
        </ScrollLayer>
      </ScrollScene>

      <ClientShowcase />
    </main>
  )
}

"use client"

import { MivamaProvider } from "@mivama/ui/provider"
import { Button } from "@mivama/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@mivama/ui/dialog"
import { Switch } from "@mivama/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mivama/ui/tabs"

export function ClientShowcase() {
  return (
    <MivamaProvider
      theme="product"
      density="compact"
      className="grid gap-4 rounded-xl border border-border p-6"
    >
      <Tabs defaultValue="client">
        <TabsList aria-label="Client fixture sections">
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="package">Package</TabsTrigger>
        </TabsList>
        <TabsContent value="client">
          Interactive primitives compile behind an explicit client boundary.
        </TabsContent>
        <TabsContent value="package">
          The package is installed only from the generated npm tarball.
        </TabsContent>
      </Tabs>

      <Switch aria-label="Fixture toggle" />

      <Dialog>
        <DialogTrigger render={<Button />}>Open client dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Next.js client boundary</DialogTitle>
          <DialogDescription>
            Dialog, tabs, switch, provider, and button compile as client code.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </MivamaProvider>
  )
}

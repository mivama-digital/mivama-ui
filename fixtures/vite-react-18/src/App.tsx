import { MivamaProvider, Text } from "@mivama/ui"
import { Button } from "@mivama/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mivama/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@mivama/ui/dialog"
import { Field, FieldDescription, FieldLabel, Input } from "@mivama/ui/forms"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mivama/ui/tabs"

export function App() {
  return (
    <MivamaProvider
      theme="product"
      density="comfortable"
      className="min-h-screen bg-background p-8 text-foreground"
    >
      <main className="mx-auto grid max-w-3xl gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vite React 18 consumer</CardTitle>
            <CardDescription>
              This page compiles against the packed @mivama/ui distribution.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Text>
              The fixture exercises the root barrel, component subpaths, forms,
              overlays, tabs, and packaged styles.
            </Text>

            <Field>
              <FieldLabel htmlFor="consumer-email">Email</FieldLabel>
              <Input id="consumer-email" type="email" />
              <FieldDescription>
                Used only to verify the consumer form API.
              </FieldDescription>
            </Field>

            <Tabs defaultValue="overview">
              <TabsList aria-label="Fixture sections">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                Root and subpath imports compile.
              </TabsContent>
              <TabsContent value="details">
                Tailwind package styles compile.
              </TabsContent>
            </Tabs>

            <Dialog>
              <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
              <DialogContent>
                <DialogTitle>Consumer dialog</DialogTitle>
                <DialogDescription>
                  Client-side overlay primitives compile in a Vite application.
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </MivamaProvider>
  )
}

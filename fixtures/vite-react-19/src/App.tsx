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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@mivama/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@mivama/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mivama/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@mivama/ui/tooltip"

export function App() {
  return (
    <MivamaProvider
      theme="product"
      density="comfortable"
      className="min-h-screen bg-background text-foreground"
    >
      <SidebarProvider
        defaultOpen
        persistence="localStorage"
        storageKey="consumer-sidebar-e2e"
      >
        <Sidebar
          collapsible="icon"
          mobileTitle="Consumer navigation"
          mobileDescription="Primary navigation for the packed consumer testbed."
        >
          <SidebarHeader>
            <strong>Consumer navigation</strong>
            <SidebarInput aria-label="Sidebar search" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Projects</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>Consumer footer</SidebarFooter>
          <SidebarRail label="Toggle consumer navigation" />
        </Sidebar>

        <SidebarInset className="p-8">
          <div className="mx-auto grid w-full max-w-3xl gap-6">
            <SidebarTrigger label="Toggle consumer navigation" />

            <Card>
              <CardHeader>
                <CardTitle render={<h1 />}>Vite React 19 consumer</CardTitle>
                <CardDescription>
                  This page compiles against the packed @mivama/ui distribution.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Text>
                  The fixture exercises the root barrel, component subpaths,
                  forms, overlays, tabs, sidebar, and packaged styles.
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

                <div className="flex flex-wrap gap-3">
                  <Dialog>
                    <DialogTrigger render={<Button />}>
                      Open dialog
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Consumer dialog</DialogTitle>
                      <DialogDescription>
                        Client-side overlay primitives compile in a Vite
                        application.
                      </DialogDescription>
                      <Input aria-label="Dialog email" type="email" />
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger render={<Button variant="outline" />}>
                      Open sheet
                    </SheetTrigger>
                    <SheetContent>
                      <SheetTitle>Consumer sheet</SheetTitle>
                      <SheetDescription>
                        Sheet focus management is exercised from the packed
                        distribution.
                      </SheetDescription>
                      <Input aria-label="Sheet email" type="email" />
                    </SheetContent>
                  </Sheet>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger render={<Button variant="outline" />}>
                        Tooltip target
                      </TooltipTrigger>
                      <TooltipContent>Consumer tooltip</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MivamaProvider>
  )
}
